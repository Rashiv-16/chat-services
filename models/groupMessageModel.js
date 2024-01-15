const mongoose = require("mongoose");
const { Schema } = mongoose;

const groupMessageSchema = new Schema({
  group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);
module.exports = GroupMessage;
