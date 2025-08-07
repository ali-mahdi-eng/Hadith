let backBtn = document.getElementById('back-btn');
let subjectList = document.getElementById('subject-list');




function getSectionNameFromURL() {
    let params = new URLSearchParams(window.location.search);
    let currentSection = params.get("section");
    document.querySelector("title").textContent = currentSection;
    return currentSection;
}


async function getJsonData() {
    let url = "./data/hadith.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`response status: ${response.status}`);
        }
        const dataReceived = await response.json();
        
        var data = dataReceived[getSectionNameFromURL()];
        for (let subject in data) {
            createSubject(subject);
        }
    }
    catch(err) {
        console.error("ERR", err.message);
    }
}
getJsonData();


function createSubject(subjectName) {
    let li = document.createElement("li");
        li.className = "subject";
        li.textContent = subjectName;
        li.addEventListener("click", ()=>{ goToContentPage(subjectName); });
    subjectList.appendChild(li);
}


function goToContentPage(subjectName) {
    let nextPage = "content.html";
    let dataToSend = `section=${getSectionNameFromURL()}&subject=${subjectName}`;
    window.location.href = nextPage + "?" + dataToSend;
}


function goBack() {
    history.go(-1);
}
backBtn.addEventListener("click", goBack);