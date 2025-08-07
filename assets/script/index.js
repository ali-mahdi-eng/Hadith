let allSections = document.querySelectorAll(".section");

allSections.forEach((section)=>{
    section.addEventListener("click", ()=>{
        window.location.href = section.getAttribute("data-url")
    });
});

