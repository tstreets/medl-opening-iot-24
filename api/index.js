const path = require("path");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const users = {};

const creatureBase = {
  health: 5,
  atk: 1,
  def: 0,
  head: "",
  arms: "",
  legs: "",
  userId: "",
  userName: "",
  image: "",
  activeTurn: false,
};

const creaturesStats = {
  1: {},
  2: {},
};

app.get("/api", function (req, res) {
  res.redirect("https://github.com/tstreets/medl-opening-iot-24");
});

app.use("/api/circuit-city", require("./circuit-city"));
app.use("/api/creature-combat", require("./creature-combat"));

app.all("/api/*", function (req, res) {
  res.status(404).json({ error: "Endpoint not found" });
});

app.use(express.static(path.join(__dirname, "../views")));

app.use("socket.io", express.static("node_modules/socket.io"));

const port = process.env.PORT || 3007;

const server = app.listen(port);

const io = new Server(server);

io.on("connection", (socket) => {
  const clientId = socket.client.id;
  const timeJoined = Date.now();
  users[clientId] = { timeJoined, creature: {} };

  socket.on(
    "creature-attempt-ready",
    function ({ creatureNum, includeImages, userEmail, userName }) {
      users[clientId].active = true;
      users[clientId].id = clientId;
      users[clientId].email = userEmail;
      users[clientId].name = userName;
      users[clientId].includeImages = includeImages;
      let isCreature =
        (creatureNum === 2 || creatureNum === 1) &&
        !creaturesStats[creatureNum].userId;

      if (isCreature) {
        creaturesStats[creatureNum] = {
          ...creatureBase,
          userId: clientId,
          userName: userName,
          activeTurn: !Object.values(creaturesStats).some((s) => s.activeTurn),
        };
      }
      socket.emit("user-joined", users[clientId], isCreature);

      io.emit("creatures-stats", creaturesStats);
    }
  );

  socket.on("creatures-attack", function ({ dmg, pc }) {
    if (creaturesStats[pc] && dmg) {
      creaturesStats[pc].health -= dmg;
      const otherPc = pc === 1 ? 2 : 1;
      creaturesStats[pc].activeTurn = true;
      creaturesStats[otherPc].activeTurn = false;
      io.emit("creatures-stats", creaturesStats);
    }
  });

  socket.on("creatures-reset", function () {
    creaturesStats = { 1: {}, 2: {} };
    io.emit("creatures-stats", creaturesStats);
  });

  socket.on("disconnect", function () {
    // delete users[clientId];
    users[clientId].active = false;
  });
});

console.log(`Local server running at http://localhost:${port}`);

module.exports = app;
