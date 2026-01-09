require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./src/config/db");

const programRoutes = require("./src/routes/programRoutes");

const app = express();

/* =====================
   Middleware
===================== */
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// Routes for pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/programs", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "programs.html"));
});


/* =====================
   Database
===================== */
connectDB();

/* =====================
   Serve Frontend
===================== */
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/programs", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "programs.html"));
});

/* =====================
   API Routes
===================== */
app.use("/api/programs", programRoutes);

/* =====================
   Server
===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
