"use strict";

const {
  createTableIfNotExists,
  dropTableIfExists,
  dropEnumIfExists,
} = require("./lib/migration-utils");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Publication Categories
    await createTableIfNotExists(queryInterface, "publication_categories", {
      category_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      name_am: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description_am: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      display_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 2. Publications Table
    await createTableIfNotExists(queryInterface, "publications", {
      publication_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      title_am: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      slug: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      summary_am: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description_am: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      authors: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      publication_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      document_type: {
        type: Sequelize.ENUM(
          "research_report",
          "mineral_map",
          "book_manual",
          "technical_publication",
          "geological_study",
          "training_material",
          "policy_strategy",
          "other"
        ),
        defaultValue: "research_report",
        allowNull: false,
      },
      language: {
        type: Sequelize.STRING(50),
        defaultValue: "en",
        allowNull: false,
      },
      reference_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      page_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      publish_status: {
        type: Sequelize.ENUM("draft", "pending_review", "published", "archived"),
        defaultValue: "draft",
        allowNull: false,
      },
      access_mode: {
        type: Sequelize.ENUM("open_access", "online_only", "enquiry_required", "restricted"),
        defaultValue: "open_access",
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0.0,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(10),
        defaultValue: "ETB",
        allowNull: false,
      },
      cover_image_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "attachments",
          key: "attachment_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      views_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      downloads_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 3. Publication Categories Map (Join Table)
    await createTableIfNotExists(queryInterface, "publication_categories_map", {
      publication_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "publications",
          key: "publication_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        primaryKey: true,
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "publication_categories",
          key: "category_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        primaryKey: true,
      },
    });

    // 4. Publication Files Table (Protected document attachments)
    await createTableIfNotExists(queryInterface, "publication_files", {
      publication_file_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      publication_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "publications",
          key: "publication_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      attachment_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "attachments",
          key: "attachment_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      file_role: {
        type: Sequelize.ENUM(
          "main_pdf",
          "supplementary_pdf",
          "map_document",
          "cover_image",
          "other_attachment"
        ),
        defaultValue: "main_pdf",
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      file_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      file_path: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      file_size: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      mime_type: {
        type: Sequelize.STRING(100),
        defaultValue: "application/pdf",
        allowNull: false,
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      downloads_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 5. Publication Inquiries Table
    await createTableIfNotExists(queryInterface, "publication_inquiries", {
      inquiry_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      publication_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "publications",
          key: "publication_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      inquiry_type: {
        type: Sequelize.ENUM(
          "general_inquiry",
          "document_request",
          "access_request",
          "paid_publication_request"
        ),
        defaultValue: "general_inquiry",
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      company: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      reference_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM(
          "pending",
          "under_review",
          "payment_pending",
          "approved",
          "rejected",
          "closed"
        ),
        defaultValue: "pending",
        allowNull: false,
      },
      admin_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      assigned_to: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      reviewed_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 6. Publication Payments Table
    await createTableIfNotExists(queryInterface, "publication_payments", {
      payment_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      inquiry_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "publication_inquiries",
          key: "inquiry_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      publication_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "publications",
          key: "publication_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(10),
        defaultValue: "ETB",
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM("bank_transfer", "telebirr_manual", "cbe_birr", "other"),
        defaultValue: "bank_transfer",
        allowNull: false,
      },
      transaction_reference: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      slip_attachment_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "attachments",
          key: "attachment_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: Sequelize.ENUM("submitted", "under_verification", "verified", "rejected"),
        defaultValue: "submitted",
        allowNull: false,
      },
      verified_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      admin_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 7. Publication Access Grants Table
    await createTableIfNotExists(queryInterface, "publication_access_grants", {
      grant_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      publication_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "publications",
          key: "publication_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      inquiry_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "publication_inquiries",
          key: "inquiry_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      access_token: {
        type: Sequelize.STRING(128),
        allowNull: false,
        unique: true,
      },
      access_level: {
        type: Sequelize.ENUM("online_only", "download_allowed"),
        defaultValue: "online_only",
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      downloads_used: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      max_downloads: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      granted_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await dropTableIfExists(queryInterface, "publication_access_grants");
    await dropTableIfExists(queryInterface, "publication_payments");
    await dropTableIfExists(queryInterface, "publication_inquiries");
    await dropTableIfExists(queryInterface, "publication_files");
    await dropTableIfExists(queryInterface, "publication_categories_map");
    await dropTableIfExists(queryInterface, "publications");
    await dropTableIfExists(queryInterface, "publication_categories");

    await dropEnumIfExists(queryInterface, "enum_publications_document_type");
    await dropEnumIfExists(queryInterface, "enum_publications_publish_status");
    await dropEnumIfExists(queryInterface, "enum_publications_access_mode");
    await dropEnumIfExists(queryInterface, "enum_publication_files_file_role");
    await dropEnumIfExists(queryInterface, "enum_publication_inquiries_inquiry_type");
    await dropEnumIfExists(queryInterface, "enum_publication_inquiries_status");
    await dropEnumIfExists(queryInterface, "enum_publication_payments_payment_method");
    await dropEnumIfExists(queryInterface, "enum_publication_payments_status");
    await dropEnumIfExists(queryInterface, "enum_publication_access_grants_access_level");
  },
};
