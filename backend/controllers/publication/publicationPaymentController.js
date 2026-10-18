"use strict";

const crypto = require("crypto");
const {
  PublicationPayment,
  PublicationInquiry,
  Publication,
  PublicationAccessGrant,
  Attachment,
  User,
  sequelize,
} = require("../../models");
const { sendEmail } = require("../../utils/sendEmail");

// POST /api/publication-payments (Submit payment evidence)
exports.submitPayment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      inquiry_id,
      publication_id,
      amount,
      currency = "ETB",
      payment_method,
      transaction_reference,
      slip_attachment_id,
      admin_notes,
    } = req.body;

    const inquiry = await PublicationInquiry.findByPk(inquiry_id);
    if (!inquiry) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Associated inquiry not found." });
    }

    const publication = await Publication.findByPk(publication_id);
    if (!publication) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Associated publication not found." });
    }

    // Check if payment already exists for this inquiry
    let payment = await PublicationPayment.findOne({ where: { inquiry_id } });

    if (payment) {
      await payment.update(
        {
          amount,
          currency,
          payment_method: payment_method || "bank_transfer",
          transaction_reference,
          slip_attachment_id: slip_attachment_id || null,
          status: "under_verification",
          admin_notes,
          updated_at: new Date(),
        },
        { transaction: t }
      );
    } else {
      payment = await PublicationPayment.create(
        {
          inquiry_id,
          publication_id,
          amount,
          currency,
          payment_method: payment_method || "bank_transfer",
          transaction_reference,
          slip_attachment_id: slip_attachment_id || null,
          status: "under_verification",
          admin_notes,
        },
        { transaction: t }
      );
    }

    // Update inquiry status to under_review
    await inquiry.update({ status: "under_review", updated_at: new Date() }, { transaction: t });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Payment evidence submitted successfully. Awaiting administrative verification.",
      data: payment,
    });
  } catch (error) {
    await t.rollback();
    console.error("Submit Payment Error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit payment evidence." });
  }
};

// GET /api/publication-payments (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const { status, publication_id, page, limit } = req.query;

    const whereClause = { deleted_at: null };
    if (status && status !== "all") {
      whereClause.status = status;
    }
    if (publication_id) {
      whereClause.publication_id = publication_id;
    }

    const queryOptions = {
      where: whereClause,
      include: [
        {
          model: PublicationInquiry,
          as: "inquiry",
          attributes: ["inquiry_id", "reference_code", "name", "email", "phone", "company"],
        },
        {
          model: Publication,
          as: "publication",
          attributes: ["publication_id", "title", "slug", "price", "access_mode"],
        },
        {
          model: Attachment,
          as: "slipAttachment",
        },
        {
          model: User,
          as: "verifier",
          attributes: ["user_id", "full_name", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
    };

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
      queryOptions.limit = limitNum;
      queryOptions.offset = (pageNum - 1) * limitNum;

      const { count, rows } = await PublicationPayment.findAndCountAll(queryOptions);

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

    const payments = await PublicationPayment.findAll(queryOptions);
    return res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error("Get Payments Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch payments." });
  }
};

// POST /api/publication-payments/:id/verify (Admin)
exports.verifyPayment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      status, // 'verified' or 'rejected'
      rejection_reason,
      admin_notes,
      grant_access = true,
      access_level = "download_allowed",
      expires_in_days = 30,
    } = req.body;

    const payment = await PublicationPayment.findByPk(id, {
      include: [
        { model: PublicationInquiry, as: "inquiry" },
        { model: Publication, as: "publication" },
      ],
    });

    if (!payment) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Payment record not found." });
    }

    const now = new Date();
    const verifierId = req.user?.user_id || null;

    if (status === "verified") {
      await payment.update(
        {
          status: "verified",
          verified_by: verifierId,
          verified_at: now,
          admin_notes,
          updated_at: now,
        },
        { transaction: t }
      );

      // Update inquiry status
      if (payment.inquiry) {
        await payment.inquiry.update(
          {
            status: "approved",
            reviewed_by: verifierId,
            reviewed_at: now,
            updated_at: now,
          },
          { transaction: t }
        );
      }

      let grantRecord = null;
      if (grant_access && payment.inquiry) {
        // Generate secure random access token
        const accessToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = expires_in_days
          ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000)
          : null;

        grantRecord = await PublicationAccessGrant.create(
          {
            publication_id: payment.publication_id,
            inquiry_id: payment.inquiry_id,
            email: payment.inquiry.email,
            access_token: accessToken,
            access_level: access_level || "download_allowed",
            expires_at: expiresAt,
            max_downloads: 5,
            is_active: true,
            granted_by: verifierId,
          },
          { transaction: t }
        );

        // Send email with access link
        const readerUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/publications/${payment.publication.slug}?token=${accessToken}`;
        const emailSubject = `[MIDI] Payment Verified & Publication Access Granted`;
        const emailBody = `Dear ${payment.inquiry.name},

Your payment of ${payment.amount} ${payment.currency} for the publication "${payment.publication.title}" has been verified by the Mineral Industry Development Institute.

You have been granted access to view and download this publication.
Access Link: ${readerUrl}
Access Token: ${accessToken}
Valid Until: ${expiresAt ? expiresAt.toLocaleDateString() : "Permanent"}

Thank you for engaging with MIDI research publications.

Mineral Industry Development Institute (MIDI)
Addis Ababa, Ethiopia`;

        sendEmail(payment.inquiry.email, emailSubject, emailBody).catch((err) => {
          console.warn("Access grant email delivery failed (non-blocking):", err.message);
        });
      }

      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully and access granted.",
        payment,
        access_grant: grantRecord,
      });
    } else {
      // Rejection
      await payment.update(
        {
          status: "rejected",
          rejection_reason,
          verified_by: verifierId,
          verified_at: now,
          admin_notes,
          updated_at: now,
        },
        { transaction: t }
      );

      if (payment.inquiry) {
        await payment.inquiry.update(
          {
            status: "rejected",
            reviewed_by: verifierId,
            reviewed_at: now,
            updated_at: now,
          },
          { transaction: t }
        );

        const emailSubject = `[MIDI] Payment Review Update - Ref: ${payment.inquiry.reference_code}`;
        const emailBody = `Dear ${payment.inquiry.name},

Your payment submission for "${payment.publication.title}" (Ref: ${payment.inquiry.reference_code}) could not be verified.

Reason: ${rejection_reason || "Payment evidence did not match institutional records."}

Please contact the institute or submit valid payment evidence citing your reference number.

Mineral Industry Development Institute (MIDI)
Addis Ababa, Ethiopia`;

        sendEmail(payment.inquiry.email, emailSubject, emailBody).catch((err) => {
          console.warn("Rejection notification email failed (non-blocking):", err.message);
        });
      }

      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Payment marked as rejected.",
        payment,
      });
    }
  } catch (error) {
    await t.rollback();
    console.error("Verify Payment Error:", error);
    return res.status(500).json({ success: false, message: "Failed to verify payment." });
  }
};
