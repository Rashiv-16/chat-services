const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const adminRoutes = require("./routes/adminRoutes.js");
const groupRoutes = require("./routes/groupRoutes.js");
const authenticationRoutes = require("./routes/authenticationRoutes.js");

const PORT = config.get("port");
const DB_URL = config.get("db");

mongoose.connection.once("open", () => {
  console.log("MongoDB Connection Ready!!");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error!!", err);
});

const initDB = async () => {
  await mongoose.connect(DB_URL);
};
initDB();
const app = express();

app.use(express.json());

app.use("/", authenticationRoutes);
app.use("/admin", adminRoutes);
app.use("/groups", groupRoutes);

module.exports = app;
