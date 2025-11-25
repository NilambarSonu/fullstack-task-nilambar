// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

let session;
let passport;
try {
  // lazy require session & passport — if missing we log and continue to avoid hard crash
  session = require("express-session");
  passport = require("passport");
} catch (err) {
  console.warn("Optional package missing:", err.message);
}

try {
  // passport config may require models, so require it lazily and catch errors
  require("./config/passport");
} catch (err) {
  console.warn("Error loading passport config (continuing):", err.message);
}

const app = express();
app.use(express.json({ limit: "10mb" }));

// CORS - limit to FRONTEND_URL in production
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

// Serverless-safe MongoDB connection helper
async function connectToDatabase() {
  // prefer MONGO_URI, but fall back to MONGODB_URI
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("Missing MongoDB connection string. Set MONGO_URI or MONGODB_URI in env.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (global._mongoConnectPromise) {
    await global._mongoConnectPromise;
    return mongoose;
  }

  // attach short serverSelectionTimeout to fail fast if DB is unreachable
  const connectOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
  };

  global._mongoConnectPromise = mongoose.connect(mongoUri, connectOpts);

  await global._mongoConnectPromise;
  return mongoose;
}

// Session & passport (only if express-session loaded successfully)
if (session && passport) {
  app.use(session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production"
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());
} else {
  console.warn("express-session or passport not available — continuing without session support.");
}

// IMPORTANT: Do NOT connect to DB synchronously on import (serverless cold-start).
// Instead, connect when the function runs (middleware) or when running locally.
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error("Mongo connect error (middleware):", err.message || err);
    // return a 503 so caller sees DB unavailability quickly
    return res.status(503).json({ ok: false, message: "Database connection failed", error: err.message });
  }
});

// Quick health check — responds immediately if function is healthy
app.get("/api/health", (_req, res) => res.json({ ok: true, now: new Date().toISOString() }));

// Routes (these files must not do any heavy sync work at import time)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/task"));

// Export app immediately so serverless wrapper can wrap it fast
module.exports = app;

// If running locally (node server.js), connect and listen
if (require.main === module) {
  connectToDatabase()
    .then(() => {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => console.log(`🚀 Local server running on port ${PORT}`));
    })
    .catch(err => {
      console.error("Fatal DB connect error:", err);
      process.exit(1);
    });
}
