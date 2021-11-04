const express = require("express");
const cors = require("cors");
const path = require("path");

const urlRoute = require("./routes/url");
const redirectRoute = require("./routes/redirect");
const authRoute = require("./routes/auth");

const connection = require("./config/db.config");
connection.once("open", () => console.log("DB connected"));
connection.on("error", () => console.log("Error"));

/* Initiate app */
const app = express();

app.use(cors());

app.use(
  express.json({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));
/* Routes */
app.use("/", redirectRoute);
app.use("/api/url", urlRoute);
app.use("/api/auth", authRoute);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}`);
});
