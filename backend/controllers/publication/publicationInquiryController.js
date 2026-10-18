"use strict";

const {
  PublicationInquiry,
  Publication,
  PublicationPayment,
  PublicationAccessGrant,
  Attachment,
  User,
} = require("../../models");
const { Op } = require("sequelize");
const { sendEmail } = require("../../utils/sendEmail");

const generateReferenceCode = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MIDI-PUB-${year}-${random}`;
};

// POST /api/publication-inquiries (Public)
exports.submitInquiry = async (req, res) => {
  try {
    const { publication_id, inquiry_type, name, company, email, phone, message } = req.body;

    const publication = await Publication.findByPk(publication_id);
    if (!publication || publication.publish_status !== "published") {
      return res.status(404).json({ success: false, message: "Target publication not found or unavailable." });
    }

    let reference_code = generateReferenceCode();
    // Ensure uniqueness
    let existing = await PublicationInquiry.findOne({ where: { reference_code } });
    while (existing) {
      reference_code = generateReferenceCode();
      existing = await PublicationInquiry.findOne({ where: { reference_code } });
    }

    const inquiry = await PublicationInquiry.create({
      publication_id,
      inquiry_type: inquiry_type || "general_inquiry",
      name,
      company: company || null,
      email,
      phone: phone || null,
      message,
      reference_code,
      status: "pending",
    });

    // Send email confirmation asynchronously (does not block or fail if SMTP is not configured)
    const emailSubject = `[MIDI] Inquiry Received - Ref: ${reference_code}`;
    const emailBody = `Dear ${name},

Thank you for contacting the Mineral Industry Development Institute (MIDI), Ethiopia.

We have received your inquiry regarding the publication: "${publication.title}".
Your inquiry reference code is: ${reference_code}

Inquiry Type: ${inquiry_type}
Status: Received & Pending Review

An institutional officer will review your request. If your inquiry involves payment or formal document access, verified institutional instructions will follow.

Mineral Industry Development Institute (MIDI)
Addis Ababa, Ethiopia
www.midi.gov.et`;

    sendEmail(email, emailSubject, emailBody).catch((err) => {
      console.warn("Inquiry receipt email notification failed (non-blocking):", err.message);
    });

    return res.status(201).json({
      success: true,
      message: "Your inquiry has been submitted successfully. Please retain your reference code.",
      reference_code,
      inquiry_id: inquiry.inquiry_id,
    });
  } catch (error) {
    console.error("Submit Publication Inquiry Error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit publication inquiry." });
  }
};

// GET /api/publication-inquiries (Admin)
exports.getAllInquiries = async (req, res) => {
  try {
    const { status, inquiry_type, search, publication_id, page, limit } = req.query;

    const whereClause = { deleted_at: null };

    if (status && status !== "all") {
      whereClause.status = status;
    }

    if (inquiry_type && inquiry_type !== "all") {
      whereClause.inquiry_type = inquiry_type;
    }

    if (publication_id) {
      whereClause.publication_id = publication_id;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { reference_code: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const queryOptions = {
      where: whereClause,
      include: [
        {
          model: Publication,
          as: "publication",
          attributes: ["publication_id", "title", "slug", "document_type", "access_mode", "price"],
        },
        {
          model: PublicationPayment,
          as: "payment",
          attributes: ["payment_id", "amount", "currency", "payment_method", "status", "transaction_reference"],
        },
      ],
      order: [["created_at", "DESC"]],
    };

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
      queryOptions.limit = limitNum;
      queryOptions.offset = (pageNum - 1) * limitNum;

      const { count, rows } = await PublicationInquiry.findAndCountAll(queryOptions);

      return res.status(200).json({
        success: true,
        data: rows,
        meta: {
          total: count,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(count / limitNum),
        },
      });
    }

    const inquiries = await PublicationInquiry.findAll(queryOptions);
    return res.status(200).json({ success: true, data: inquiries });
  } catch (error) {
    console.error("Get All Inquiries Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch inquiries." });
  }
};

// GET /api/publication-inquiries/:id (Admin)
exports.getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await PublicationInquiry.findByPk(id, {
      include: [
        {
          model: Publication,
          as: "publication",
        },
        {
          model: PublicationPayment,
          as: "payment",
          include: [{ model: Attachment, as: "slipAttachment" }],
        },
        {
          model: PublicationAccessGrant,
          as: "accessGrants",
        },
        {
          model: User,
          as: "reviewer",
          attributes: ["user_id", "full_name", "email"],
        },
        {
          model: User,
          as: "assignee",
          attributes: ["user_id", "full_name", "email"],
        },
      ],
    });

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }

    return res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    console.error("Get Inquiry Details Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch inquiry details." });
  }
};

// PUT /api/publication-inquiries/:id/status (Admin)
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes, assigned_to } = req.body;

    const validStatuses = ["pending", "under_review", "payment_pending", "approved", "rejected", "closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid inquiry status." });
    }

    const inquiry = await PublicationInquiry.findByPk(id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }

    const updateData = {
      status,
      reviewed_by: req.user?.user_id || null,
      reviewed_at: new Date(),
      updated_at: new Date(),
    };

    if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to;

    await inquiry.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Inquiry status updated successfully.",
      data: inquiry,
    });
  } catch (error) {
    console.error("Update Inquiry Status Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update inquiry status." });
  }
};

// POST /api/publication-inquiries/:id/reply (Admin)
exports.replyToInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply_message, send_email = true } = req.body;

    if (!reply_message || !reply_message.trim()) {
      return res.status(400).json({ success: false, message: "Reply message cannot be empty." });
    }

    const inquiry = await PublicationInquiry.findByPk(id, {
      include: [{ model: Publication, as: "publication" }],
    });

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }

    const now = new Date();
    const updatedNotes = inquiry.admin_notes
      ? `${inquiry.admin_notes}\n\n[Reply on ${now.toISOString()}]:\n${reply_message}`
      : `[Reply on ${now.toISOString()}]:\n${reply_message}`;

    await inquiry.update({
      status: "under_review",
      admin_notes: updatedNotes,
      reviewed_by: req.user?.user_id,
      reviewed_at: now,
    });

    if (send_email && inquiry.email) {
      const subject = `[MIDI] Response to your inquiry [Ref: ${inquiry.reference_code}]`;
      const body = `Dear ${inquiry.name},

Regarding your inquiry on "${inquiry.publication?.title || "MIDI Publication"}" (Ref: ${inquiry.reference_code}):

${reply_message}

If you have additional questions, please reply citing your reference number.

Mineral Industry Development Institute (MIDI)
Addis Ababa, Ethiopia`;

      sendEmail(inquiry.email, subject, body).catch((err) => {
        console.warn("Failed to send reply email (non-blocking):", err.message);
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reply recorded and sent successfully.",
      data: inquiry,
    });
  } catch (error) {
    console.error("Reply to Inquiry Error:", error);
    return res.status(500).json({ success: false, message: "Failed to send inquiry reply." });
  }
};

// DELETE /api/publication-inquiries/:id (Admin)
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await PublicationInquiry.findByPk(id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }

    await inquiry.destroy();

    return res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Inquiry Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete inquiry." });
  }
};
