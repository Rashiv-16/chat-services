const mongoose = require("mongoose");
const { Schema } = mongoose;

const groupSchema = new Schema({
  name: { type: String, required: true, unique: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
