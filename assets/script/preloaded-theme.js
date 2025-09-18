let appTheme = document.querySelector("#app-theme");
// Get Saved Theme
let selectedTheme = localStorage.getItem("theme") || "green.css";
appTheme.href = `assets/style/theme/${selectedTheme}`;