const mongoose = require("mongoose");

const URLSchema = new mongoose.Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Url", URLSchema);
