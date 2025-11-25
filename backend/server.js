// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const session = require("express-session");
const passport = require("passport");
require("./config/passport"); // Import config

const app = express();

// body parser
app.use(express.json({ limit: "10mb" }));

// cors - allow only frontend origin in production
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

// serverless-friendly mongoose connection
async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return; // already connected
  if (global._mongoosePromise) {
    await global._mongoosePromise;
    return;
  }
  global._mongoosePromise = mongoose.connect(process.env.MONGO_URI);
  await global._mongoosePromise;
}
connectToDatabase()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Session + passport
app.use(session({
  secret: process.env.SESSION_SECRET || "dev-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "none",
    secure: process.env.NODE_ENV === "production" // secure only in prod
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// quick health route
app.get("/api/health", (req, res) => res.json({ ok: true, now: new Date().toISOString() }));

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/task"));

// export app for serverless (Vercel)
module.exports = app;

// if run locally with `node backend/server.js`, start listener
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Local server running on port ${PORT}`));
}
