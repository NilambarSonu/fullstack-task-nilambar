const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true }, // Removed required: true
  password: { type: String }, // Removed required: true
  googleId: { type: String },
  githubId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);