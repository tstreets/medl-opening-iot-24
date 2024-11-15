import "/socket.io/socket.io.js";

const socket = io();

document.querySelector("#form-confirm").onclick = function () {
  const userEmail = document.querySelector("#email").value.trim().toLowerCase();
  const includeImages = document.querySelector("#pics").checked;

  if (userEmail) {
    const creatureNum = location.hash.split("#p")[1].slice(0, 1);
    socket.emit("creature-attempt-ready", {
      creatureNum: Number(creatureNum),
      includeImages: includeImages,
      userEmail: userEmail,
    });
  }
};

document.querySelector('a[href="#surrender"]').style.display = "none";
document.querySelector('a[href="#surrender"]').onclick = function (e) {
  e.preventDefault();
  location.assign("/creature-combat");
};
