const jwt = require("jsonwebtoken");
const config = require("config");

const authenticateMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, config.get("jwt_secret"), (err, user) => {
    if (err) return res.sendStatus(403);
    req.userId = user.id;
    req.user = user;
    next();
  });
};

module.exports = authenticateMiddleware;
