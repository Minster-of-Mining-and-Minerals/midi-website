const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const bodyParser = require("body-parser");

dotenv.config({ path: path.join(__dirname, ".env"), override: true });

const { swaggerUi, swaggerSpec } = require("./swagger");

// ================== Here Import Routes=================

// ================== User Routes ==========================
const userRoute = require("./routers/user-routes/userRoutes");
const roleRoute = require("./routers/user-routes/roleRoutes");
const userRoleRoute = require("./routers/user-routes/userRoleRoutes");
const authRoute = require("./routers/user-routes/authRoutes");
const permissionRoute = require("./routers/user-routes/permissionRoutes");
const changePasswordRoutes = require("./routers/user-routes/passwordChangeRoutes");


// ================== Service Routes ==========================
const serviceRoute = require("./routers/sevice/serviceRoutes");
const serviceOverviewRoute = require("./routers/sevice/serviceOverviewRoutes");
const serviceExperienceRoute = require("./routers/sevice/serviceExperienceRoutes");
const serviceCapabilityRoute = require("./routers/sevice/serviceCapabilityRoutes");
const serviceWhyUsRoute = require("./routers/sevice/serviceWhyUsRoutes");


// ================== About Page Routes ==========================
const backgroundRoute = require("./routers/about/backgroundRoutes");
const leadershipRoute = require("./routers/about/leadershipRoutes");
const strategyRoute = require("./routers/about/strategyRoutes");
const certificationRoute = require("./routers/about/certificationRoutes");
const careerContentRoute = require("./routers/about/careerContentRoutes");

// ================== Contact Page Routes ==========================
const federalOfficeRoute = require("./routers/contact/federalOfficeRoutes");
const regionRoute = require("./routers/contact/regionRoutes");
const regionalOfficeRoute = require("./routers/contact/regionalOfficeRoutes");
const messageRoute = require("./routers/contact/messageRoutes");
const vacancyRoute = require("./routers/contact/vacancyRoutes");
const jobApplicationRoute = require("./routers/contact/jobApplicationRoutes");

// ================== Footer Page Routes ==========================
const socialMediaRoute = require("./routers/footer/socialMediaRoutes");
const footerRoute = require("./routers/footer/footerRoutes");

// ================== Hero Section Routes ==========================
const cardRoute = require("./routers/hero/cardRoute");
const sliderRoute = require("./routers/hero/sliderRoute");
const partnerRoute = require("./routers/hero/partnerRoute");
const purposeRoute = require("./routers/hero/purposeRoute");
const canvasRoute = require("./routers/hero/canvasRoute");


// ================== ASM Routes ==========================
const asmRoute = require("./routers/asm/asmRoutes");

// ================== Investigate Ethiopia Routes ==========================
const investigateEthiopiaRoute = require("./routers/investigate_ethiopia/investigateEthiopiaRoutes");

// ================== Attachment Routes ==========================
const attachmentRoute = require("./routers/attachement/attachementRoutes");


// ================== System Routes ==========================
const auditLogRoute = require("./routers/system/auditLogRoutes");
const dashboardRoute = require("./routers/system/dashboardRoutes");
const routesRoute = require("./routers/route/routeRoute");
const pageHeaderRoute = require("./routers/system/pageHeaderRoutes");

// ================== Product Routes ==========================
const productRoute = require("./routers/product/productRoutes");
const productCategoryRoute = require("./routers/product/productCategoryRoutes");
const productInquiryRoute = require("./routers/product/productInquiryRoutes");

// ================== Publication Routes ==========================
const publicationRoute = require("./routers/publication/publicationRoutes");
const publicationCategoryRoute = require("./routers/publication/publicationCategoryRoutes");
const publicationInquiryRoute = require("./routers/publication/publicationInquiryRoutes");
const publicationPaymentRoute = require("./routers/publication/publicationPaymentRoutes");

// ================== Business Routes ==========================
const businessRoute = require("./routers/business/businessRoutes");

// ================== News Routes ==========================
const newsRoute = require("./routers/news/newsRoutes");
const tagRoute = require("./routers/news/tagRoutes");

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
const appServer = http.createServer(app);

// ================== Security Headers ==================
// No X-Frame-Options here: publication PDFs from this server are embedded by the frontend.
app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(
  express.json({
    verify: (req, res, buf) => {
      if (!buf.length) return; // allow empty body
      try {
        JSON.parse(buf);
      } catch (e) {
        // Don't throw the error after sending response
        const error = new Error("Invalid JSON payload");
        error.status = 400;
        error.expose = true;
        throw error;
      }
    },
  }),
);

app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "200mb" }));

// ===========Serve static files (PDFs, uploads)=====================
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, filePath) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      if (filePath.endsWith(".pdf")) {
        res.set("Content-Disposition", "inline");
      }
    },
  }),
);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      if (/\.(webp|jpe?g|png|gif|svg)$/i.test(filePath)) {
        res.set("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  }),
);

// ================== CORS Configuration ==================
const defaultAllowedOrigins = [
  "http://10.100.14.6:3005",
  "http://10.100.14.6:8085",
  "http://10.100.14.6:4005",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3005",
  "http://localhost:4000",
  "http://localhost:4005",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3005",
  process.env.FRONTEND_URL,
].filter(Boolean);

const envOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envOrigins]));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    return callback(new Error(`CORS error: Origin ${origin} not allowed by Access-Control-Allow-Origin`));
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// ================== Database Connection ==================
const { sequelize } = require("./models");

sequelize
  .authenticate()
  .then(() => console.log(" Database connected successfully"))
  .catch((err) => console.error(" Database connection error:", err));

// ================== Swagger Setup ==================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ================== API Routes go here ==================

// ================== User Routes ==========================
app.use("/api/users", userRoute);
app.use("/api/roles", roleRoute);
app.use("/api/user-roles", userRoleRoute);
app.use("/api/auth", authRoute);
app.use("/api/change-password", changePasswordRoutes);
app.use("/api/permissions", permissionRoute);


// ================== Service Routes ==========================
app.use("/api/services", serviceRoute);
app.use("/api/service-overview", serviceOverviewRoute);
app.use("/api/service-experience", serviceExperienceRoute);
app.use("/api/service-capability", serviceCapabilityRoute);
app.use("/api/service-why-us", serviceWhyUsRoute);


// ================== About Page Routes ==========================
app.use("/api/backgrounds", backgroundRoute);
app.use("/api/leadership", leadershipRoute);
app.use("/api/strategy", strategyRoute);
app.use("/api/certifications", certificationRoute);
app.use("/api/career-content", careerContentRoute);

// ================== Contact Page Routes ==========================
app.use("/api/federal-office", federalOfficeRoute);
app.use("/api/region", regionRoute);
app.use("/api/regional-offices", regionalOfficeRoute);
app.use("/api/message", messageRoute);
app.use("/api/vacancies", vacancyRoute);
app.use("/api/job-applications", jobApplicationRoute);

// ================== Footer Page Routes ==========================
app.use("/api/social-media", socialMediaRoute);
app.use("/api/footer", footerRoute);

// ================== Hero Section Routes ==========================
app.use("/api/cards", cardRoute);
app.use("/api/sliders", sliderRoute);
app.use("/api/partners", partnerRoute);
app.use("/api/purpose", purposeRoute);
app.use("/api/canvas", canvasRoute);


// ================== ASM Routes ==========================
app.use("/api/asm", asmRoute);

// ================== Investigate Ethiopia Routes ==========================
app.use("/api/investigate-ethiopia", investigateEthiopiaRoute);

// ================== Api Attachment Routes =====================
app.use("/api/attachments", attachmentRoute);


// ================== System Routes =====================
app.use("/api/audit-logs", auditLogRoute);
app.use("/api/dashboard-analytics", dashboardRoute);
app.use("/api/routes", routesRoute);
app.use("/api/page-headers", pageHeaderRoute);

// ================== Product Routes =====================
app.use("/api/products", productRoute);
app.use("/api/product-categories", productCategoryRoute);
app.use("/api/product-inquiries", productInquiryRoute);

// ================== Publication Routes =====================
app.use("/api/publications", publicationRoute);
app.use("/api/publication-categories", publicationCategoryRoute);
app.use("/api/publication-inquiries", publicationInquiryRoute);
app.use("/api/publication-payments", publicationPaymentRoute);

// ================== Business Routes =====================
app.use("/api/business", businessRoute);

// ================== News Routes =====================
app.use("/api/news", newsRoute);
app.use("/api/tags", tagRoute);

// ================== Health Checks & Root Endpoint ==================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", service: "midi-backend", timestamp: new Date().toISOString() });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy", service: "midi-backend-api", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Mineral Industry Development Institute (MIDI) API 🚀" });
});

// ================== Error Handler ==================
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ================== Start App Server ==================
const appPort = process.env.PORT || 4000;
appServer.listen(appPort, "0.0.0.0", () => {
  console.log(`MIDI Backend API server running on 0.0.0.0:${appPort}`);
});

// ================== Socket.IO Setup ==================
const socketServer = http.createServer();
const io = new Server(socketServer, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    onlineUsers.set(userId, socket.id);
    console.log(` User ${userId} connected: ${socket.id}`);
  }

  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    console.log(`User ${userId} disconnected`);
  });
});

const socketPort = process.env.SOCKET_PORT || 5000;
socketServer.listen(socketPort, "0.0.0.0", () => {
  console.log(`MIDI Socket.IO server running on 0.0.0.0:${socketPort}`);
});

// Make Socket.IO accessible globally
app.set("socketio", io);

// ================== Graceful Shutdown ==================
const gracefulShutdown = () => {
  console.log("\n[backend] Received termination signal. Initiating graceful shutdown...");
  io.close(() => {
    console.log("[backend] Socket.IO server closed.");
  });
  socketServer.close(() => {
    console.log("[backend] Socket HTTP server closed.");
  });
  appServer.close(async () => {
    console.log("[backend] Express HTTP server closed.");
    try {
      await sequelize.close();
      console.log("[backend] Database connection closed.");
    } catch (err) {
      console.error("[backend] Error closing database connection:", err);
    }
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

module.exports = { appServer, io, onlineUsers };
