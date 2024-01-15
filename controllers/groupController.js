const Group = require("../models/groupModel");
const GroupMessage = require("../models/groupMessageModel");

const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const createdBy = req.userId;
    const newGroup = new Group({ name, members, createdBy });
    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the user is the creator of the group
    if (group.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        message: "Access denied. You are not the creator of the group.",
      });
    }

    await Group.findByIdAndDelete(req.params.groupId);
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendMessageToGroup = async (req, res) => {
  try {
    const { content } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const newMessage = new GroupMessage({
      group: group._id,
      sender: req.userId,
      content,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const likeGroupMessage = async (req, res) => {
  try {
    const message = await GroupMessage.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if the user has already liked the message
    if (message.likes.includes(req.userId)) {
      return res
        .status(400)
        .json({ message: "You have already liked this message" });
    }

    message.likes.push(req.userId);
    const updatedMessage = await message.save();
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchGroup = async (req, res) => {
  try {
    const { query } = req.query;
    const groups = await Group.find({ name: new RegExp(query, "i") });
    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addMemberToGroup = async (req, res) => {
  try {
    const { memberId } = req.body;
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.members.includes(memberId)) {
      return res
        .status(400)
        .json({ message: "User already a member of the group" });
    }

    group.members.push(memberId);
    const updatedGroup = await group.save();
    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error getting groups:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMessagesOfAGroup = async (req, res) => {
  try {
    const messages = await GroupMessage.find({ group: req.params.groupId });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting messages of a group:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createGroup,
  deleteGroup,
  sendMessageToGroup,
  likeGroupMessage,
  searchGroup,
  addMemberToGroup,
  getGroups,
  getMessagesOfAGroup,
};
