require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  /* Extract token from string */
  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(403).json({
      success: false,
      message: "Inauthorized request",
    });

  jwt.verify(token, secret, (err, user) => {
    if (err)
      return res.status(403).json({
        success: false,
        message: "Unauthorized request",
      });
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
