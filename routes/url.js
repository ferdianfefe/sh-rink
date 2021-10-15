/* Route to take incoming POST request, generate short URL, and save it into database */
const router = require("express").Router();
const shortid = require("shortid");
const validUrl = require("valid-url");
const verifyToken = require("../middleware/verifyToken");

const Url = require("../models/Url");

router.post("/shorten", verifyToken, async (req, res) => {
  /* Get long url from request */
  let { longUrl } = req.body;

  if (!validUrl.isUri(longUrl)) {
    return res.status(401).json({
      success: false,
      message: "Invalid long URL",
    });
  }

  const urlCode = shortid.generate();

  try {
    let url = await Url.findOne({
      longUrl,
    });

    if (url) {
      return res.json({
        success: true,
        value: {
          url: url.shortUrl,
        },
      });
    } else {
      const shortUrl = "http://localhost:3000/" + urlCode;

      url = new Url({
        urlCode,
        longUrl,
        shortUrl,
        creator: req.user._id,
        date: new Date(),
      });

      await url.save();
      return res.status(201).json({
        success: true,
        message: "New url successfully generated",
        value: {
          url: shortUrl,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.get("/list", verifyToken, async (req, res) => {
  urls = await Url.find({ creator: req.user._id });
  if (urls && urls.length) {
    return res.status(200).json({
      success: true,
      value: { urls },
    });
  }
});

module.exports = router;
