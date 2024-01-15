const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "normal"], default: "normal" },
});

// RBAC Middleware
userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

const User = mongoose.model("User", userSchema);

module.exports = User;
