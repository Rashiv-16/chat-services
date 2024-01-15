const express = require("express");
const groupController = require("../controllers/groupController");
const authenticateToken = require("../middlewares/authenticateMiddleware");
const router = express.Router();

router
  .get("/", authenticateToken, groupController.getGroups)
  .post("/create", authenticateToken, groupController.createGroup)
  .delete("/:groupId", authenticateToken, groupController.deleteGroup)
  .post(
    "/:groupId/messages/send",
    authenticateToken,
    groupController.sendMessageToGroup
  )
  .post(
    "/:groupId/messages/:messageId/like",
    authenticateToken,
    groupController.likeGroupMessage
  )
  .get(
    "/:groupId/messages",
    authenticateToken,
    groupController.getMessagesOfAGroup
  )
  .get("/search", authenticateToken, groupController.searchGroup)
  .post(
    "/:groupId/add-member",
    authenticateToken,
    groupController.addMemberToGroup
  );

module.exports = router;
