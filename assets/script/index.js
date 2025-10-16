let allSections = document.querySelectorAll(".section");
let allHiddenSections = document.querySelectorAll(".hidden-section");
let moreBtn = document.querySelector(".more-btn");
let moreBtnText = document.querySelector(".more-btn-text");
let moreBtnIcon = document.querySelector(".more-btn-icon");
let openSettingsBtn = document.querySelector(".open-settings-btn");
let closeSettingsBtn = document.querySelector(".close-settings-btn");
let openAboutAppBtn = document.querySelector(".open-about-app-btn");
let closeAboutAppBtn = document.querySelector(".close-about-app-btn");

let isShowMoreOn = false;


allSections.forEach((section)=>{
    section.addEventListener("click", ()=>{
        let tragetPage = section.getAttribute("data-url");
        let targetSection = section.getAttribute("data-section") || "";
        window.location.href = tragetPage + "?" + `section=${targetSection}`;
    });
});


// Save (show more sections) state
if (sessionStorage.getItem("isShowMoreOn") === "true") showMoreSections();
// Capsulation/Encapsulation Sections
function showMoreSections() {
    if (!isShowMoreOn) {
        allHiddenSections.forEach((e)=> {e.style.display = "flex"});
        isShowMoreOn = true;
        moreBtnText.style.order = "2";
        moreBtnIcon.style.order = "1";
        moreBtnText.textContent = "عرض أقل";
        moreBtnIcon.style.rotate = "180deg";
    }
    else {
        allHiddenSections.forEach((e)=> {e.style.display = "none"});
        isShowMoreOn = false;
        moreBtnText.textContent = "عرض المزيد";
        moreBtnIcon.style.rotate = "0deg";
        moreBtnText.style.order = "1";
        moreBtnIcon.style.order = "2";
    }
    // Update state in storage
    sessionStorage.setItem("isShowMoreOn", isShowMoreOn);
}
moreBtn.addEventListener("click", showMoreSections);



// Open/Close Settings
openSettingsBtn?.addEventListener("click",()=>{ document.querySelector(".settings-container").style.display = "flex"; });
closeSettingsBtn?.addEventListener("click",()=>{ document.querySelector(".settings-container").style.display = "none"; });
// Open/Close About App Section
openAboutAppBtn?.addEventListener("click",()=>{ document.querySelector(".about-app-container").style.display = "flex"; });
closeAboutAppBtn?.addEventListener("click",()=>{ document.querySelector(".about-app-container").style.display = "none"; });
