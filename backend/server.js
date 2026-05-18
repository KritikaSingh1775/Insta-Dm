import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import leadRoutes from "./routes/lead.routes.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import campaignRoutes from "./routes/campaign.routes.js";
import instagramRoutes from "./routes/instagram.routes.js";

import { errorHandler } from "./utils/errorHandler.js";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

// Security Headers
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});

app.use("/api", limiter);


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin) ||
        origin.includes("ngrok")
      ) {
        return callback(null, true);
      }

      return callback(null, true);
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.options(/.*/, cors());

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Athenura API running 🚀",
  });
});

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server healthy",
    environment: env.NODE_ENV,
    timestamp: new Date(),
  });
});

app.get("/webhook", (req, res) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (
      mode === "subscribe" &&
      token === env.META_WEBHOOK_VERIFY_TOKEN
    ) {
      console.log("✅ WEBHOOK VERIFIED");

      return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
  } catch (error) {
    console.error("❌ WEBHOOK VERIFY ERROR:", error);

    return res.sendStatus(500);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    console.log(
      "📩 WEBHOOK EVENT:",
      JSON.stringify(req.body, null, 2)
    );

    const entry = req.body.entry?.[0];

    const change = entry?.changes?.[0];

    if (change?.field === "comments") {
      const commentText =
        change?.value?.text?.toLowerCase();

      console.log("💬 COMMENT:", commentText);

      if (commentText?.includes("price")) {
        console.log(
          "🔥 KEYWORD MATCHED → SEND DM HERE"
        );

        // TODO:
        // Send Instagram DM here
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);

    return res.sendStatus(500);
  }
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/campaigns", campaignRoutes);
app.use("/api/v1/leads", leadRoutes);
app.use("/api/v1/instagram", instagramRoutes);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    console.log("✅ MongoDB connected");

    const server = app.listen(env.PORT, () => {
      console.log(`
🚀 Server Running
🌍 Environment : ${env.NODE_ENV}
📡 Port        : ${env.PORT}
🔗 URL         : http://localhost:${env.PORT}
      `);
    });

    server.on("error", (err) => {
      console.error("❌ Server Error:", err);
    });
  } catch (err) {
    console.error(
      "❌ MongoDB Connection Failed:",
      err.message
    );

    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.error(
    "❌ Unhandled Rejection:",
    err?.message || err
  );
});

process.on("uncaughtException", (err) => {
  console.error(
    "❌ Uncaught Exception:",
    err?.message || err
  );

  process.exit(1);
});