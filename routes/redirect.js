const router = require("express").Router();

const Url = require("../models/Url");

router.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({
      urlCode: req.params.code,
    });

    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
