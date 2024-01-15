const User = require("../models/userModel");

const isAdminMiddleware = async (req, res, next) => {
  try {
    // Assuming you have the user's ID in req.userId from your authentication middleware
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin()) {
      return res.status(403).send("Access denied. Admins only.");
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = isAdminMiddleware;
