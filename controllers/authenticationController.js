const express = require("express");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const router = express.Router();

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && password === user.password) {
      const token = jwt.sign(
        { id: user._id, role: user.role, user: user },
        config.get("jwt_secret"),
        { expiresIn: "1h" }
      );
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { login };
