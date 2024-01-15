const express = require("express");
const adminController = require("../controllers/adminController");
const isAdminMiddleware = require("../middlewares/adminMiddleware");
const authenticateMiddleware = require("../middlewares/authenticateMiddleware");
const router = express.Router();

router
  .get(
    "/users",
    authenticateMiddleware,
    isAdminMiddleware,
    adminController.getUsers
  )
  .post(
    "/user",
    authenticateMiddleware,
    isAdminMiddleware,
    adminController.createUser
  )
  .put(
    "/user/:userId",
    authenticateMiddleware,
    isAdminMiddleware,
    adminController.editUser
  )
  .delete(
    "/user/:userId",
    authenticateMiddleware,
    isAdminMiddleware,
    adminController.deleteUser
  );

module.exports = router;
