"use strict";

const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { moveFileSync } = require("../../utils/fileMove");
const {
  Publication,
  PublicationFile,
  PublicationAccessGrant,
  User,
  Role,
  RolePermission,
  Permission,
} = require("../../models");

// Protected storage directory outside /uploads
const PROTECTED_STORAGE_DIR = path.resolve(__dirname, "../../storage/publications");
if (!fs.existsSync(PROTECTED_STORAGE_DIR)) {
  fs.mkdirSync(PROTECTED_STORAGE_DIR, { recursive: true });
}

/**
 * Helper to authenticate token if present in headers or query
 */
const checkUserAuth = async (req) => {
  const authHeader = req.headers["x-authorization"] || req.headers["authorization"];
  const token = (authHeader && authHeader.split(" ")[1]) || req.query.auth_token;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.user_id, {
      attributes: ["user_id", "email", "full_name", "is_active"],
      include: [
        {
          model: Role,
          as: "roles",
          include: [
            {
              model: RolePermission,
              as: "rolePermissions",
              include: [
                {
                  model: Permission,
                  as: "permission",
                  attributes: ["resource", "action"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user || !user.is_active) return null;

    const flattenedPermissions = [
      ...new Set(
        user.roles.flatMap((role) =>
          role.rolePermissions
            .filter((rp) => rp.permission?.resource && rp.permission?.action)
            .map((rp) => `${rp.permission.resource}:${rp.permission.action}`)
        )
      ),
    ];

    return {
      user_id: user.user_id,
      email: user.email,
      roles: user.roles.map((r) => r.name),
      permissions: flattenedPermissions,
    };
  } catch (err) {
    return null;
  }
};

/**
 * Check if access grant token is valid
 */
const verifyAccessGrant = async (accessToken, publicationId, requireDownload = false) => {
  if (!accessToken) return false;

  const grant = await PublicationAccessGrant.findOne({
    where: {
      access_token: accessToken,
      publication_id: publicationId,
      is_active: true,
    },
  });

  if (!grant) return false;

  // Check expiration
  if (grant.expires_at && new Date() > new Date(grant.expires_at)) {
    return false;
  }

  // Check download limits if download is required
  if (requireDownload) {
    if (grant.access_level !== "download_allowed") return false;
    if (grant.max_downloads && grant.downloads_used >= grant.max_downloads) return false;
  }

  return grant;
};

/**
 * Helper to stream file with HTTP Range support for PDF seek
 */
const streamFile = (filePath, mimeType, filename, isDownload, req, res) => {
  // Validate path traversal
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(PROTECTED_STORAGE_DIR)) {
    // If it's stored in uploads/attachments from legacy attachment table
    const uploadsDir = path.resolve(__dirname, "../../uploads");
    if (!resolvedPath.startsWith(uploadsDir)) {
      return res.status(403).json({ success: false, message: "Invalid file path." });
    }
  }

  if (!fs.existsSync(resolvedPath)) {
    return res.status(404).json({ success: false, message: "Requested file not found on server." });
  }

  const stat = fs.statSync(resolvedPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  const disposition = isDownload ? "attachment" : "inline";
  const cleanFilename = encodeURIComponent(filename || path.basename(resolvedPath));

  res.setHeader("Content-Type", mimeType || "application/pdf");
  res.setHeader("Content-Disposition", `${disposition}; filename="${cleanFilename}"`);
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      res.setHeader("Content-Range", `bytes */${fileSize}`);
      return res.status(416).end();
    }

    const chunksize = end - start + 1;
    const fileStream = fs.createReadStream(resolvedPath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Content-Length": chunksize,
    });

    fileStream.pipe(res);
  } else {
    res.setHeader("Content-Length", fileSize);
    const fileStream = fs.createReadStream(resolvedPath);
    fileStream.pipe(res);
  }
};

/**
 * View publication document (inline PDF reader)
 * GET /api/publications/:id/view or /api/publications/:id/files/:fileId/view
 */
exports.viewDocument = async (req, res) => {
  try {
    const { id, fileId } = req.params;
    const { token } = req.query;

    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    const publication = await Publication.findOne({
      where: isUuid ? { publication_id: id } : { slug: id },
      include: [{ model: PublicationFile, as: "files" }],
    });

    if (!publication) {
      return res.status(404).json({ success: false, message: "Publication not found." });
    }

    const authUser = await checkUserAuth(req);
    const isAdmin = authUser?.permissions?.includes("publications:read");

    // Check publication publish status
    if (publication.publish_status !== "published" && !isAdmin) {
      return res.status(403).json({ success: false, message: "Publication is not published." });
    }

    // Access mode authorization
    const accessMode = publication.access_mode;
    if (accessMode === "restricted" && !isAdmin) {
      return res.status(403).json({ success: false, message: "Access restricted to authorized personnel." });
    }

    if (accessMode === "enquiry_required" && !isAdmin) {
      const grant = await verifyAccessGrant(token, publication.publication_id, false);
      if (!grant) {
        return res.status(403).json({
          success: false,
          message: "Access token required. Please submit an enquiry to request document access.",
        });
      }
    }

    // Determine which file to serve
    let targetFile;
    if (fileId) {
      targetFile = publication.files.find((f) => f.publication_file_id === fileId);
    } else {
      targetFile =
        publication.files.find((f) => f.file_role === "main_pdf") ||
        publication.files.find((f) => f.mime_type === "application/pdf") ||
        publication.files[0];
    }

    if (!targetFile) {
      return res.status(404).json({ success: false, message: "No document file found for this publication." });
    }

    // Atomically increment views count
    Publication.increment("views_count", { by: 1, where: { publication_id: publication.publication_id } }).catch(
      () => {}
    );

    const filename = `${publication.slug}.pdf`;
    return streamFile(targetFile.file_path, targetFile.mime_type, filename, false, req, res);
  } catch (error) {
    console.error("View Document Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error streaming document." });
  }
};

/**
 * Download publication document
 * GET /api/publications/:id/download or /api/publications/:id/files/:fileId/download
 */
exports.downloadDocument = async (req, res) => {
  try {
    const { id, fileId } = req.params;
    const { token } = req.query;

    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    const publication = await Publication.findOne({
      where: isUuid ? { publication_id: id } : { slug: id },
      include: [{ model: PublicationFile, as: "files" }],
    });

    if (!publication) {
      return res.status(404).json({ success: false, message: "Publication not found." });
    }

    const authUser = await checkUserAuth(req);
    const isAdmin = authUser?.permissions?.includes("publications:read");

    if (publication.publish_status !== "published" && !isAdmin) {
      return res.status(403).json({ success: false, message: "Publication is not published." });
    }

    // Download rules by access mode
    if (publication.access_mode === "online_only" && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Download is disabled for online-only publications. You may view this document in the online reader.",
      });
    }

    if (publication.access_mode === "restricted" && !isAdmin) {
      return res.status(403).json({ success: false, message: "Access restricted to authorized personnel." });
    }

    let grant = null;
    if (publication.access_mode === "enquiry_required" && !isAdmin) {
      grant = await verifyAccessGrant(token, publication.publication_id, true);
      if (!grant) {
        return res.status(403).json({
          success: false,
          message: "Valid download access token required. Please submit an access request or verify payment.",
        });
      }
    }

    let targetFile;
    if (fileId) {
      targetFile = publication.files.find((f) => f.publication_file_id === fileId);
    } else {
      targetFile =
        publication.files.find((f) => f.file_role === "main_pdf") ||
        publication.files.find((f) => f.mime_type === "application/pdf") ||
        publication.files[0];
    }

    if (!targetFile) {
      return res.status(404).json({ success: false, message: "No document file available for download." });
    }

    // Increment downloads count atomically
    Publication.increment("downloads_count", { by: 1, where: { publication_id: publication.publication_id } }).catch(
      () => {}
    );
    PublicationFile.increment("downloads_count", {
      by: 1,
      where: { publication_file_id: targetFile.publication_file_id },
    }).catch(() => {});

    if (grant) {
      grant.increment("downloads_used", { by: 1 }).catch(() => {});
    }

    const filename = `${publication.slug}${path.extname(targetFile.file_path) || ".pdf"}`;
    return streamFile(targetFile.file_path, targetFile.mime_type, filename, true, req, res);
  } catch (error) {
    console.error("Download Document Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error downloading document." });
  }
};

/**
 * Upload protected publication PDF / map / supplementary document
 * POST /api/publications/upload-document
 */
exports.uploadProtectedDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No document file uploaded." });
    }

    const originalName = req.file.originalname;
    const ext = path.extname(originalName).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    const destinationPath = path.join(PROTECTED_STORAGE_DIR, uniqueName);

    // Move file from multer temp (uploads/temp) to protected storage; in Docker these are
    // separate mounts, so a plain rename fails with EXDEV
    moveFileSync(req.file.path, destinationPath);

    return res.status(201).json({
      success: true,
      message: "Document uploaded to protected storage successfully.",
      file: {
        file_name: originalName,
        file_path: destinationPath.replace(/\\/g, "/"),
        file_size: req.file.size,
        mime_type: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error("Upload Protected Document Error:", error);
    return res.status(500).json({ success: false, message: "Failed to process document upload." });
  }
};

exports.PROTECTED_STORAGE_DIR = PROTECTED_STORAGE_DIR;
