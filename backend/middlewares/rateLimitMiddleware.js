"use strict";

const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");

// General settings for error responses
const handler = (req, res, next, options) => {
    res.status(options.statusCode).json({
        success: false,
        message: options.message
    });
};

const skipIfAuthenticated = (req, res) => {
    const authHeader = req.headers["x-authorization"] || req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return true;
        } catch (err) {
            return false;
        }
    }
    return false;
};

// 1. Contact Submissions (10 req / 15 min / IP)
exports.contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many contact messages from this IP, please try again after 15 minutes.",
    handler,
    skip: skipIfAuthenticated
});

// 2. Product Inquiries (10 req / 15 min / IP)
exports.productInquiryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many product inquiries from this IP, please try again after 15 minutes.",
    handler,
    skip: skipIfAuthenticated
});

// 2b. Publication Inquiries (10 req / 15 min / IP)
exports.publicationInquiryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many publication inquiries from this IP, please try again after 15 minutes.",
    handler,
    skip: skipIfAuthenticated
});

// 3. Job Applications (5 req / 1 hour / IP)
exports.jobApplicationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many job applications from this IP, please try again after an hour.",
    handler,
    skip: skipIfAuthenticated
});

// 4. File Uploads (10 req / 1 hour / IP)
exports.fileUploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many file uploads from this IP, please try again after an hour.",
    handler,
    skip: skipIfAuthenticated
});

// 5. News Interactions (30 req / 15 min / IP)
exports.newsInteractionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many interactions from this IP, please try again after 15 minutes.",
    handler,
    skip: skipIfAuthenticated
});
