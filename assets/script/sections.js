let backBtn = document.getElementById('back-btn');
let sectionList = document.getElementById('section-list');






async function getJsonData() {
    let url = "./data/hadith.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`response status: ${response.status}`);
        }
        const data = await response.json();
        
        console.log("'sections.js>>' Data Form API:", data);
        for (let section in data) {
            createNewPortion(section);
        }
    }
    catch (err) {
        console.error("ERR", err.message);
    }
}
getJsonData();


function createNewPortion(portionName) {
    let li = document.createElement("li");
        li.className = "subject";
        li.textContent = portionName;
        li.addEventListener("click", ()=>{ goToNextPage(portionName); });
    sectionList.appendChild(li);
}


function goToNextPage(sectionName) {
    let nextPage = "subjects.html";
    let dataToSend = `section=${sectionName}`;
    window.location.href = nextPage + "?" + dataToSend;
}


function goBack() {
    history.go(-1);
}
backBtn.addEventListener("click", goBack);