const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", function (req, res) {
  res.redirect("https://github.com/tstreets/medl-opening-iot-24");
});

app.use("/api/circuit-city", require("./circuit-city"));
app.use("/api/creature-combat", require("./creature-combat"));

app.all("/api/*", function (req, res) {
  res.status(404).json({ error: "Endpoint not found" });
});

module.exports = app;
