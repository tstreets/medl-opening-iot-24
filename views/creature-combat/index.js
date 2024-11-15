import "/socket.io/socket.io.js";

const socket = io();

document.querySelector(".reset-game").onclick = function () {
  const pass = document.querySelector(".reset-pass").value.trim();
  if (pass === "123abc") {
    socket.emit("creatures-reset");
  }
};
