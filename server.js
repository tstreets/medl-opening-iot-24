const http = require("http");
const path = require("path");
const express = require("express");

const app = require("./api");

app.use(express.static(path.join(__dirname, "views")));

const server = http.createServer(app);
server.listen(process.env.PORT || 3007);

console.log(
  `Local server running at http://localhost:${process.env.PORT || 3007}`
);
