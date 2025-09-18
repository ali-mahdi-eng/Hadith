// use IIFE to avoid variables declaration multiple times (in multiple files)
(()=> {
    let appTheme = document.querySelector("#app-theme");
    let themesList = document.querySelector(".themes-list-input");
    let allThemes = document.querySelectorAll(".themes-list-input option");
    
    // Get Saved Theme
    let selectedTheme = localStorage.getItem("theme") || themesList.value;
    
    // change default select value Text
    allThemes.forEach((e)=> {
        e.selected = false;
        e.defaultSelected = false;
        if (e.value === selectedTheme) {
            e.selected = true;
            e.defaultSelected = true;
        }
    });
    
    function updateTheme() {
        // update theme value
        selectedTheme = themesList.value;
        // Apply Theme
        appTheme.href = `assets/style/theme/${selectedTheme}`;
        // Save Theme
        localStorage.setItem("theme", selectedTheme);
    }
    themesList.addEventListener("input", updateTheme);
})();