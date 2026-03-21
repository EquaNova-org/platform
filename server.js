require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./src/config/db");
const { runCollector } = require("./src/services/collectorService");
const { startScheduler, stopScheduler } = require("./src/services/scheduler");

const programRoutes = require("./src/routes/programRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");

const app = express();

/* =====================
   Middleware
===================== */
app.use(cors());
app.use(express.json());

/* =====================
   Startup
===================== */
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    // One-time collector on boot
    runCollector().catch(err =>
      console.error("❌ Initial collector failed:", err.message)
    );

    // Cron scheduler
    startScheduler();
    console.log("⏱ Scheduler started");

  } catch (err) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
};

startServer();

/* =====================
   Health Check
===================== */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/* =====================
   API Routes
===================== */
app.use("/api/programs", programRoutes);
app.use("/api", bookingRoutes)
