const path = require("path");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

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

app.use(express.static(path.join(__dirname, "../views")));

const port = process.env.PORT || 3007;

const server = app.listen(port);

const io = new Server(server);

const users = {};

io.on("connection", (socket) => {
  const clientId = socket.client.id;
  const timeJoined = Date.now();
  users[clientId] = { timeJoined, creature: {} };

  socket.on(
    "creature-attempt-ready",
    function ({ creatureNum, includeImages }) {
      users[clientId].ready = true;
      if (creatureNum === 2 || creatureNum === 1) {
        users[clientId].creature.creatureNum = creatureNum;
        users[clientId].creature.includeImages = includeImages;
        users[clientId].email = userEmail;
      }
    }
  );

  socket.on("disconnect", function () {
    // delete users[clientId];
  });
});

console.log(`Local server running at http://localhost:${port}`);

module.exports = app;
