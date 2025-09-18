let allSections = document.querySelectorAll(".section");
let openSettingsBtn = document.querySelector(".open-settings-btn");
let closeSettingsBtn = document.querySelector(".close-settings-btn");

allSections.forEach((section)=>{
    section.addEventListener("click", ()=>{
        window.location.href = section.getAttribute("data-url")
    });
});



openSettingsBtn?.addEventListener("click", ()=>{
    document.querySelector(".settings-container").style.display = "flex";
});

closeSettingsBtn?.addEventListener("click", ()=>{
    document.querySelector(".settings-container").style.display = "none";
});
