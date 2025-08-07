let backBtn = document.getElementById('back-btn');
let sectionList = document.getElementById('section-list');



function getJsonData() {
    let url = "./data/api/shia/ahl-albyt-list.json";
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            let imamList = data;
            for (let imam in imamList.source) {
                createNewPortion(imamList.source[imam], imamList.text[imam]);
            }
            document.querySelector("title").textContent = "أهل البيت";
        });
}
getJsonData();


function goBack() {
    history.go(-1);
}
backBtn.addEventListener("click", goBack);



function createNewPortion(portionFileName, portionName) {
    let li = document.createElement("li");
        li.className = "subject";
        li.textContent = portionName;
        li.addEventListener("click", ()=>{ goToNextPage(portionFileName); });
    sectionList.appendChild(li);
}

function goToNextPage(imamName) {
    let nextPage = "hadith-ahl-albyt.html";
    let dataToSend = `imamName=${imamName}`;
    window.location.href = nextPage + "?" + dataToSend;
}
