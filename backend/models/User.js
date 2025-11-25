const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String },
  googleId: { type: String },
  githubId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
