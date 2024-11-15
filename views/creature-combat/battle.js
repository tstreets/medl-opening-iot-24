import "/socket.io/socket.io.js";
import { animals, adjectives } from "./data.js";

const surrenderRef = document.querySelector('a[href="#surrender"]');
const creationNameRef = document.querySelector(".creation-title  span");
const loaderRef = document.querySelector(".loader");

// Section refs

const battleRef = document.querySelector(".battle");
const creationRef = document.querySelector(".creation");

const socket = io();

function generateRandomName() {
  loaderRef.classList.remove("hide");
  const randomAnimal = animals[parseInt(Math.random() * animals.length)];
  const randomAdjective =
    adjectives[parseInt(Math.random() * adjectives.length)];
  const newName = `${
    randomAdjective[0].toUpperCase() + randomAdjective.slice(1)
  } ${randomAnimal}`;

  creationNameRef.innerHTML = newName;
  creationNameRef.dataset.name = newName;
  if (!loaderRef.classList.contains("hide")) loaderRef.classList.add("hide");
}

function attemptReadyUser() {
  loaderRef.classList.remove("hide");
  const userEmail = document.querySelector("#email").value.trim().toLowerCase();
  const includeImages = document.querySelector("#pics").checked;
  if (userEmail && userEmail.endsWith("@iu.edu")) {
    const creatureNum = location.hash.includes("#p")
      ? location.hash.split("#p")[1].slice(0, 1)
      : "";
    socket.emit("creature-attempt-ready", {
      creatureNum: Number(creatureNum),
      includeImages: includeImages,
      userEmail: userEmail,
      creatureName: creationNameRef.dataset.name,
    });
  } else {
    alert("Please enter you school email");
    if (!loaderRef.classList.contains("hide")) loaderRef.classList.add("hide");
  }
}

function reconnectUser(e) {
  e.preventDefault();
  loaderRef.classList.remove("hide");
  const userEmail = prompt("School Email:", "");

  socket.emit("creature-reconnect-user", {
    userEmail: userEmail,
  });

  setTimeout(function () {
    if (!loaderRef.classList.contains("hide")) loaderRef.classList.add("hide");
    document.querySelector(".error-returning-user").innerHTML =
      "Email not found, please try again or create a creature.";
  }, 5 * 1000);
}

document.querySelector(".returning-user").onclick = reconnectUser;

document.querySelector(".shuffle.icon").onclick = generateRandomName;

document.querySelector("#form-confirm").onclick = attemptReadyUser;

surrenderRef.style.display = "none";
surrenderRef.onclick = function (e) {
  e.preventDefault();
  location.assign("/creature-combat");
};

generateRandomName();

creationRef.style.display = "grid";
// battleRef.style.display = "grid";
