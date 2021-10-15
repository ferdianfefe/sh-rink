require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* Sign Up */
router.post("/signup", async (req, res) => {
  let { name, username, password } = req.body;
  let user = await User.findOne({ username });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "Username is taken",
    });
  }

  let salt = await bcrypt.genSalt(10);
  let hashed = await bcrypt.hash(password, salt);
  let newUser = new User({
    name,
    username,
    password: hashed,
  });

  newUser.save((err) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err,
      });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      value: newUser,
    });
  });
});

/* Sign In */
router.post("/signin", async (req, res) => {
  let { username, password } = req.body;

  let user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid username or password",
    });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({
      success: false,
      message: "Invalid username or password",
    });
  }

  /* Generate jwt token */
  let payload = {
    _id: user.id,
    name: user.name,
    username: user.username,
  };

  jwt.sign(payload, process.env.SECRET, { expiresIn: 86400 }, (err, token) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Server error",
      });

    return res.status(200).json({
      success: true,
      message: "User signed in successfully",
      value: {
        user,
        token: `Bearer ${token}`,
      },
    });
  });
});
module.exports = router;
