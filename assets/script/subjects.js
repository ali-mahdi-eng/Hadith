let backBtn = document.getElementById('back-btn');
let subjectList = document.getElementById('subject-list');


const sectionsTranslation= {
    "hadith": "الأحاديث والروايات",
    "duaas": "الأدعية",
    "zyarat": "الزيارات",
    "munajat": "المناجاة",
    "ahl-albayt": "أهل البيت",
}


function getSectionNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    const currentSection = params.get("section");
    document.querySelector("title").textContent = currentSection;
    document.querySelector(".section-title").textContent = sectionsTranslation[currentSection] || currentSection;
    return currentSection;
}
const sectionKeyName = getSectionNameFromURL();


async function getJsonData() {
    const url = `./data/${sectionKeyName}.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) { throw new Error(`response status: ${response.status}`); }
        const data = await response.json();
        let subjects = data[sectionKeyName];
        if (sectionKeyName === "hadith") {
            for (let subject in subjects) {
                createSubject(subject, null);
            }
        } else {
            for (let subject in subjects) {
                createSubject(subjects[subject]["name"], subject);
            }
        }
    }
    catch(err) { console.error("ERR", err.message); }
}
getJsonData();





function createSubject(subjectName, subjectIndex=null) {
    if (!subjectName) return;
    let li = document.createElement("li");
        li.className = "subject";
        li.textContent = subjectName;
        li.addEventListener("click", ()=>{ goToTargetPage(subjectName, subjectIndex); });
    subjectList.appendChild(li);
}


function goToTargetPage(subjectName, subjectIndex=null) {
    let nextPage = (sectionKeyName === "hadith") ? ("content.html") : ("duaas.html");
    let dataToSend = null;
    if (sectionKeyName === "hadith") {
        dataToSend = `section=${sectionKeyName}&subject=${subjectName}`;
    }else {
        dataToSend = `section=${sectionKeyName}&subject=${subjectName}&index=${subjectIndex}`;
    }
    window.location.href = nextPage + "?" + dataToSend;
}


function goBack() {
    history.go(-1);
}
backBtn.addEventListener("click", goBack);