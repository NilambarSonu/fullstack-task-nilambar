const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const session = require("express-session");
const passport = require("passport");
require("./config/passport"); // Import config

const app = express();

// Needed for Vercel serverless (no body limit)
app.use(express.json({ limit: "10mb" }));

// Enable CORS - You can restrict origin later
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

// Connect to MongoDB
let conn = null;
async function connectDB() {
  if (conn) return conn;

  conn = mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await conn;
  return conn;
}

connectDB()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongo error:", err));

// Session + passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "none",
    secure: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/task"));

// Export for Vercel serverless
module.exports = app;
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Only run when executed locally (NOT on Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Local server running on port ${PORT}`)
  );
}
