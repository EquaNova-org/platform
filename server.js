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

/* =====================
   Database
===================== */
connectDB();

/* =====================
   API Routes
===================== */
app.use("/api/programs", programRoutes);

/* =====================
   Serve Frontend (Static)
===================== */
app.use(express.static(path.join(__dirname, "public")));

// Pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/programs", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "programs.html"));
});

/* =====================
   Server
===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


