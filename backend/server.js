const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const session = require("express-session");
const passport = require("passport");
require("./config/passport"); 

const app = express();

app.use(express.json({ limit: "10mb" }));

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  if (global._mongoConnectPromise) {
    await global._mongoConnectPromise;
    return mongoose;
  }

  global._mongoConnectPromise = mongoose.connect(process.env.MONGODB_URI);

  await global._mongoConnectPromise;
  return mongoose;
}

app.use(session({
  secret: process.env.SESSION_SECRET || "dev-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "none",
    secure: process.env.NODE_ENV === "production" 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

if (require.main === module) {
  connectToDatabase()
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
}

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error("Mongo connect error (middleware):", err);
    next(err);
  }
});

// quick health route
app.get("/api/health", (req, res) => res.json({ ok: true, now: new Date().toISOString() }));

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/task"));

// export app for serverless (Vercel)
module.exports = app;
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Local server running on port ${PORT}`));
}
