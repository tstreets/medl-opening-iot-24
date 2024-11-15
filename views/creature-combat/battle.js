import "/socket.io/socket.io.js";
import { animals, adjectives } from "./data.js";

const surrenderRef = document.querySelector('a[href="#surrender"]');
const creationNameRef = document.querySelector(".creation-title  span");
const loaderRef = document.querySelector(".loader");

// Section refs

const battleRef = document.querySelector(".battle");
const creationRef = document.querySelector(".creation");

const creatureNamesRef = document.querySelectorAll(".creature-name");
const creatureHeartsRef = document.querySelectorAll(".creature-hearts");

const menuRef = document.querySelector(".menu");
const menuButtonsRef = menuRef.querySelectorAll("button:not([disabled])");

const socket = io();

let userInfo = {};

let battleInfo = {};

let mainPlayer = Math.floor(Math.random() * 2) + 1;
let secondPlayer = mainPlayer === 1 ? 2 : 1;

socket.on("user-joined", function (userServerInfo, isCreature) {
  if (!loaderRef.classList.contains("hide")) loaderRef.classList.add("hide");
  creationRef.style.display = "none";
  userInfo = userServerInfo;
  battleRef.style.display = "grid";
  if (!isCreature) {
    document.querySelector(".menu").style.display = "none";
  } else {
    menuButtonsRef.forEach(function (btnRef) {
      btnRef.setAttribute("disabled", true);
      btnRef.onclick = attackPlayer;
    });
  }
});

socket.on("creatures-stats", function (battleServerInfo) {
  battleInfo = battleServerInfo;
  updateBattle();
});

function attackPlayer() {
  socket.emit("creatures-attack", { pc: secondPlayer, dmg: 1 });
}

function updateBattle() {
  let isPC = false;
  if (battleInfo[1].userId === userInfo.id) {
    mainPlayer = 1;
    isPC = true;
  }
  if (battleInfo[2].userId === userInfo.id) {
    mainPlayer = 2;
    isPC = true;
  }
  secondPlayer = mainPlayer === 1 ? 2 : 1;

  creatureNamesRef[0].innerHTML = battleInfo[secondPlayer].userName || "";
  creatureNamesRef[1].innerHTML = battleInfo[mainPlayer].userName || "";

  creatureHeartsRef[0].innerHTML = "";
  creatureHeartsRef[1].innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const p2Filled = battleInfo[secondPlayer].health >= i;
    creatureHeartsRef[0].innerHTML += `<i class="heart ${
      p2Filled ? "" : "outline"
    } icon"></i>`;

    const p1Filled = battleInfo[mainPlayer].health >= i;
    creatureHeartsRef[1].innerHTML += `<i class="heart ${
      p1Filled ? "" : "outline"
    } icon"></i>`;
  }

  if (isPC) {
    if (!battleInfo[mainPlayer].activeTurn) {
      menuButtonsRef.forEach((btnRef) => btnRef.setAttribute("disabled", true));
    } else {
      menuButtonsRef.forEach((btnRef) => btnRef.removeAttribute("disabled"));
    }
  }
}

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
      userName: creationNameRef.dataset.name,
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
