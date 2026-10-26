// controllers/newsController.js
"use strict";
const {
    News,
    NewsAttachment,
    NewsMetadata,
    NewsReaction,
    NewsFeedback,
    NewsRead,
    NewsTag,
    Tag,
    Attachment,
    sequelize,
} = require("../../models");
const { v4: uuidv4, validate: isUuid } = require("uuid");
const { Op } = require("sequelize");
const { getRelatedNews } = require("../../utils/relatedNews");

// ===========================
// CREATE NEWS
// ===========================
const createNews = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { title, author, content, attachments, tags } = req.body;

        if (!content) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: "Content is required.",
            });
        }

        const news = await News.create(
            {
                news_id: uuidv4(),
                title,
                author,
                content,
                status: req.body.status || "draft",
                published_at: req.body.published_at || (req.body.status === "published" ? new Date() : null),
                created_at: new Date(),
                updated_at: new Date(),
            },
            { transaction: t }
        );

        /* ================= ATTACHMENTS ================= */
        if (Array.isArray(attachments) && attachments.length > 0) {
            const attachmentRows = attachments.map(({ attachment_id, category }) => ({
                news_attachment_id: uuidv4(),
                news_id: news.news_id,
                attachment_id,
                category: category || "body",
                created_at: new Date(),
            }));

            await NewsAttachment.bulkCreate(attachmentRows, { transaction: t });
        }

        /* ================= TAGS ================= */
        if (Array.isArray(tags) && tags.length > 0) {
            const tagLinks = tags.map((tag_id) => ({
                news_id: news.news_id,
                tag_id,
            }));

            await NewsTag.bulkCreate(tagLinks, { transaction: t });
        }

        /* ================= METADATA ================= */
        await NewsMetadata.create(
            {
                news_metadata_id: uuidv4(),
                news_id: news.news_id,
            },
            { transaction: t }
        );

        await t.commit();
        return res.status(201).json({
            success: true,
            message: "News created successfully",
            data: news,
        });
    } catch (error) {
        if (!t.finished) await t.rollback();
        console.error("Create News Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create news",
            error: error.message,
        });
    }
};

/* ===========================
// GET ALL NEWS
// - Supports optional pagination via `page` + `limit`. When neither is
//   provided, the old flat response is preserved so callers that consume
//   the whole list (admin dashboards, "latest news" widgets) keep working.
// - Fixes the tag filter: the previous version pushed a second include
//   for `tag_links` which duplicated the association instead of narrowing.
// =========================== */
const getAllNews = async (req, res) => {
    try {
        const { search, tag, status, isAdmin } = req.query;

        const whereClause = { deleted_at: null };
        if (search) {
            whereClause.title = { [Op.iLike]: `%${search}%` };
        }

        if (isAdmin === "true") {
            if (status) {
                whereClause.status = status;
            }
        } else {
            whereClause.status = "published";
            whereClause.published_at = {
                [Op.lte]: new Date(),
            };
        }

        const tagLinkInclude = {
            model: NewsTag,
            as: "tag_links",
            include: [
                {
                    model: Tag,
                    as: "tag",
                    ...(tag ? { where: { name: tag }, required: true } : {}),
                },
            ],
            ...(tag ? { required: true } : {}),
        };

        const includeClause = [
            {
                model: NewsAttachment,
                as: "attachments",
                include: [{ model: Attachment, as: "attachment" }],
            },
            { model: NewsMetadata, as: "metadata" },
            { model: NewsReaction, as: "reactions" },
            { model: NewsRead, as: "reads" },
            tagLinkInclude,
        ];

        const hasPagination =
            req.query.page !== undefined || req.query.limit !== undefined;

        if (hasPagination) {
            const page = Math.max(1, parseInt(req.query.page, 10) || 1);
            const limit = Math.min(
                100,
                Math.max(1, parseInt(req.query.limit, 10) || 9),
            );
            const offset = (page - 1) * limit;

            const { count, rows } = await News.findAndCountAll({
                where: whereClause,
                include: includeClause,
                order: [["created_at", "DESC"]],
                limit,
                offset,
                distinct: true,
                col: "news_id",
            });

            const totalPages = Math.max(1, Math.ceil(count / limit));

            return res.status(200).json({
                success: true,
                message: "News fetched successfully",
                data: rows,
                pagination: {
                    total: count,
                    page,
                    limit,
                    totalPages,
                },
            });
        }

        const newsList = await News.findAll({
            where: whereClause,
            include: includeClause,
            order: [["created_at", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            message: "News fetched successfully",
            count: newsList.length,
            data: newsList,
        });
    } catch (error) {
        console.error("Fetch News Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch news",
            error: error.message,
        });
    }
};

// ===========================
// GET NEWS BY ID
// ===========================
const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isUuid(id)) {
            return res.status(400).json({ success: false, message: "Invalid news ID." });
        }

        const news = await News.findByPk(id, {
            include: [
                {
                    model: NewsAttachment,
                    as: "attachments",
                    include: [{ model: Attachment, as: "attachment" }],
                },
                { model: NewsMetadata, as: "metadata" },
                { model: NewsReaction, as: "reactions" },
                { model: NewsRead, as: "reads" },
                {
                    model: NewsTag,
                    as: "tag_links",
                    include: [{ model: Tag, as: "tag" }],
                },
            ],
        });

        if (!news) {
            return res.status(404).json({ success: false, message: "News not found." });
        }

        const ip_address = req.ip;
        const userReactionRow = await NewsReaction.findOne({
            where: { news_id: id, ip_address },
            attributes: ["reaction"],
        });

        const relatedNews = await getRelatedNews(id, 10);

        const newsData = news.toJSON();
        delete newsData.reactions;

        return res.status(200).json({
            success: true,
            message: "News fetched successfully",
            data: {
                ...newsData,
                user_reaction: userReactionRow?.reaction ?? null,
                relatedNews,
            },
        });
    } catch (error) {
        console.error("Get News Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch news",
            error: error.message,
        });
    }
};

// ===========================
// UPDATE NEWS
// ===========================
const updateNews = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { title, author, content, attachment_ids, tag_ids } = req.body;

        const news = await News.findByPk(id, { transaction: t });
        if (!news) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "News not found." });
        }

        const newsData = { title, author, content, updated_at: new Date() };

        if (req.body.status) {
            newsData.status = req.body.status;
            // If transitioning to published and published_at is not set, set it to now
            if (req.body.status === "published" && !news.published_at && !req.body.published_at) {
                newsData.published_at = new Date();
            }
        }

        if (req.body.published_at !== undefined) {
            newsData.published_at = req.body.published_at;
        }

        await news.update(newsData, { transaction: t });

        // Update attachments if provided
        if (Array.isArray(attachment_ids)) {
            await NewsAttachment.destroy({ where: { news_id: id }, transaction: t });
            const attachments = attachment_ids.map(({ attachment_id, category }) => ({
                news_id: id,
                attachment_id,
                category: category || "body",
            }));
            await NewsAttachment.bulkCreate(attachments, { transaction: t });
        }

        // Update tags if provided
        if (Array.isArray(tag_ids)) {
            await NewsTag.destroy({ where: { news_id: id }, transaction: t });
            const tagLinks = tag_ids.map((tag_id) => ({ news_id: id, tag_id }));
            await NewsTag.bulkCreate(tagLinks, { transaction: t });
        }

        await t.commit();
        return res.status(200).json({
            success: true,
            message: "News updated successfully",
            data: news,
        });
    } catch (error) {
        if (!t.finished) await t.rollback();
        console.error("Update News Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update news",
            error: error.message,
        });
    }
};

// ===========================
// DELETE NEWS (soft delete)
// ===========================
const deleteNews = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;

        const news = await News.findByPk(id, { transaction: t });
        if (!news) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "News not found." });
        }

        await news.update({ deleted_at: new Date() }, { transaction: t });
        await t.commit();

        return res.status(200).json({
            success: true,
            message: "News deleted successfully (soft delete)",
        });
    } catch (error) {
        if (!t.finished) await t.rollback();
        console.error("Delete News Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete news",
            error: error.message,
        });
    }
};

// ===========================
// RECORD NEWS REACTION
// ===========================
const reactToNews = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { news_id, reaction } = req.body;
        const ip_address = req.ip;

        if (!["like", "dislike"].includes(reaction)) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Invalid reaction type." });
        }

        // Public endpoint: only published articles can be reacted to
        if (!isUuid(news_id) || !(await News.findOne({ where: { news_id, status: "published" }, transaction }))) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: "News not found." });
        }

        const existingReaction = await NewsReaction.findOne({
            where: { news_id, ip_address },
            transaction,
        });

        if (existingReaction) {
            if (existingReaction.reaction === reaction) {
                await transaction.commit();

                const metadata = await NewsMetadata.findOne({
                    where: { news_id },
                    attributes: ["like_count", "dislike_count"],
                });

                return res.status(200).json({
                    success: true,
                    message: "Reaction already recorded",
                    data: {
                        user_reaction: reaction,
                        metadata,
                    },
                });
            }

            await existingReaction.update({ reaction }, { transaction });

            if (reaction === "like") {
                await NewsMetadata.increment("like_count", { where: { news_id }, transaction });
                await NewsMetadata.decrement("dislike_count", { where: { news_id }, transaction });
            } else {
                await NewsMetadata.increment("dislike_count", { where: { news_id }, transaction });
                await NewsMetadata.decrement("like_count", { where: { news_id }, transaction });
            }
        } else {
            await NewsReaction.create(
                {
                    news_reaction_id: uuidv4(),
                    news_id,
                    ip_address,
                    reaction,
                    created_at: new Date(),
                },
                { transaction }
            );

            if (reaction === "like") {
                await NewsMetadata.increment("like_count", { where: { news_id }, transaction });
            } else {
                await NewsMetadata.increment("dislike_count", { where: { news_id }, transaction });
            }
        }

        await transaction.commit();

        const metadata = await NewsMetadata.findOne({
            where: { news_id },
            attributes: ["like_count", "dislike_count"],
        });

        const currentReaction = await NewsReaction.findOne({
            where: { news_id, ip_address },
            attributes: ["reaction"],
        });

        return res.status(200).json({
            success: true,
            message: `News ${reaction}d successfully`,
            data: {
                user_reaction: currentReaction?.reaction ?? null,
                metadata,
            },
        });
    } catch (error) {
        await transaction.rollback();
        console.error("React News Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to react to news",
            error: error.message,
        });
    }
};


// ===========================
// RECORD NEWS READ
// ===========================
const recordNewsRead = async (req, res) => {
    try {
        const { news_id } = req.body;
        const ip_address = req.ip;
        // read_time in seconds; public endpoint, so keep it to a sane per-call value
        const read_time = Math.min(Math.max(parseInt(req.body.read_time, 10) || 0, 0), 3600);

        if (!isUuid(news_id) || !(await News.findOne({ where: { news_id, status: "published" } }))) {
            return res.status(404).json({ success: false, message: "News not found." });
        }

        const [newsRead, created] = await NewsRead.findOrCreate({
            where: { news_id, ip_address },
            defaults: { news_read_id: uuidv4(), total_read_time: read_time, last_read_at: new Date() },
        });

        if (created) {
            // Increment total unique read count in metadata
            await NewsMetadata.increment("read_count", {
                where: { news_id },
            });
        } else {
            newsRead.total_read_time += read_time;
            newsRead.last_read_at = new Date();
            await newsRead.save();
        }

        return res.status(200).json({
            success: true,
            message: "News read recorded successfully",
            data: newsRead,
        });
    } catch (error) {
        console.error("Record News Read Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to record news read",
            error: error.message,
        });
    }
};

// ===========================
// RECORD NEWS FEEDBACK
// ===========================
const recordNewsFeedback = async (req, res) => {
    try {
        const { news_id, fullname, thought } = req.body;

        if (!news_id || !fullname?.trim() || !thought?.trim()) {
            return res.status(400).json({
                success: false,
                message: "News ID, full name, and feedback are required.",
            });
        }
        if (!isUuid(news_id) || fullname.trim().length > 100 || thought.trim().length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Name must be at most 100 characters and feedback at most 2000 characters.",
            });
        }

        const news = await News.findOne({
            where: { news_id, deleted_at: null, status: "published" },
        });
        if (!news) {
            return res.status(404).json({ success: false, message: "News not found." });
        }

        const newsFeedback = await NewsFeedback.create({
            news_id,
            fullname: fullname.trim(),
            thought: thought.trim(),
            is_published: false,
        });

        return res.status(200).json({
            success: true,
            message: "News feedback recorded successfully",
            data: newsFeedback,
        });
    } catch (error) {
        console.error("Record News Feedback Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to record news feedback",
            error: error.message,
        });
    }
};

// ===========================
// GET NEWS FEEDBACKS
// ===========================
const getNewsFeedbacks = async (req, res) => {
    try {
        const { news_id } = req.params;
        const { isAdmin } = req.query;

        const whereClause = { news_id };
        if (isAdmin !== "true") {
            whereClause.is_published = true;
        }

        const newsFeedbacks = await NewsFeedback.findAll({
            where: whereClause,
            order: [["created_at", "DESC"]]
        });

        return res.status(200).json({
            success: true,
            message: "News feedbacks fetched successfully",
            data: newsFeedbacks,
        });
    } catch (error) {
        console.error("Get News Feedbacks Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get news feedbacks",
            error: error.message,
        });
    }
};

// ===========================
// GET NEWS FEEDBACK COUNT
// ===========================
const getNewsFeedbackCount = async (req, res) => {
    try {
        const { news_id } = req.params;

        // Check if news exists
        const news = await News.findByPk(news_id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: "News not found.",
            });
        }

        // Count only published feedback for public display
        const feedbackCount = await NewsFeedback.count({
            where: { news_id, is_published: true },
        });

        return res.status(200).json({
            success: true,
            message: "News feedback count fetched successfully",
            data: {
                news_id,
                feedback_count: feedbackCount,
            },
        });
    } catch (error) {
        console.error("Get News Feedback Count Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch feedback count",
            error: error.message,
        });
    }
};

// ===========================
// GET ALL NEWS FEEDBACKS (ADMIN)
// ===========================
const getAllNewsFeedbacks = async (req, res) => {
    try {
        const newsFeedbacks = await NewsFeedback.findAll({
            include: [
                {
                    model: sequelize.models.News,
                    as: "news",
                    attributes: ["title"],
                },
            ],
            order: [["created_at", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            message: "All news feedbacks fetched successfully",
            count: newsFeedbacks.length,
            data: newsFeedbacks,
        });
    } catch (error) {
        console.error("Get All News Feedbacks Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch all news feedbacks",
            error: error.message,
        });
    }
};

// ===========================
// TOGGLE NEWS FEEDBACK PUBLISH STATUS
// ===========================
const toggleNewsFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const feedback = await NewsFeedback.findByPk(id);
        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found",
            });
        }

        feedback.is_published = !feedback.is_published;
        await feedback.save();

        return res.status(200).json({
            success: true,
            message: `Feedback ${feedback.is_published ? "published" : "unpublished"} successfully`,
            data: feedback,
        });
    } catch (error) {
        console.error("Toggle News Feedback Status Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update feedback status",
            error: error.message,
        });
    }
};

// ===========================
// DELETE NEWS FEEDBACK
// ===========================
const deleteNewsFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const feedback = await NewsFeedback.findByPk(id);
        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found",
            });
        }

        await feedback.destroy();

        return res.status(200).json({
            success: true,
            message: "Feedback deleted successfully",
        });
    } catch (error) {
        console.error("Delete News Feedback Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete feedback",
            error: error.message,
        });
    }
};


module.exports = {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews,
    reactToNews,
    recordNewsRead,
    recordNewsFeedback,
    getNewsFeedbacks,
    getNewsFeedbackCount,
    getAllNewsFeedbacks,
    toggleNewsFeedbackStatus,
    deleteNewsFeedback,
};
