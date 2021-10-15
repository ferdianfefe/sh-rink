require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI, (err) => {
  if (err) throw err;
  console.log("Connection to MongoDB established");
});

const connection = mongoose.connection;

module.exports = connection;
