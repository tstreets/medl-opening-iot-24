document.querySelector('a[href="#surrender"]').onclick = function (e) {
  e.preventDefault();
  location.assign("/creature-combat");
};
