let sayer = document.getElementById('sayer');
let text = document.getElementById('text');
let source = document.getElementById('source');

let nextHadithBtn = document.getElementById('next-hadith-btn');
let priviousHadithBtn = document.getElementById('privious-hadith-btn');

let backBtn = document.getElementById('back-btn');
let copyBtn = document.getElementById('copy-btn');
let alertMessage = document.getElementById('alert-message');


// Don't Delete Tutorial, will added as first element in data array.
const tutorial = {
    "sayer": "التنقل بين النصوص",
    "text": "للأنتقال الى النص التالي إضغط الحافة اليمنى للشاشة، للرجوع الى النص السابق إضغط الحافة اليسرى للشاشة.",
    "source": "التعليمات"
}



const storage = {
    imamName: getImamNameFromURL() || "Mohammed(PBUH)",
    previousIndex: JSON.parse(localStorage.getItem("storage"))?.["imamStorage"]?.[getImamNameFromURL()] || 0,
    dataSaved: JSON.parse(localStorage.getItem("storage")) || null,
}


function updateStorage() {
    let temp = (storage.dataSaved) ? (storage.dataSaved) : ({});
    temp["imamStorage"] = temp["imamStorage"] || {};
    temp["imamStorage"][storage.imamName] = storage.previousIndex;
    localStorage.setItem("storage", JSON.stringify(temp));
    /*
    Preview:
        temp = {
            section-1: {
                subject-1: index
            },
            imamStorage: {
                imamName: index,
            }
            ...
        }
    */
}


function getImamNameFromURL() {
    let params = new URLSearchParams(window.location.search);
    let currentImamName = params.get("imamName");
    document.querySelector("title").textContent = currentImamName;
    return currentImamName;
}





async function getJsonData() {
    let url = `./data/api/shia/${storage.imamName}.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`response status: ${response.status}`);
        }
        const data = await response.json();
        // Convert values of object to array
        let hadithList = Object.values(data);
        // Hide/Show [sayer & source] If There is no data found.
        if (hadithList.length > 0) {
            // Add tutorial data to Array
            hadithList.unshift(tutorial.text);
            sayer.style.visibility = "hidden";
            source.style.visibility = "visible";
            copyBtn.style.visibility = "visible";
        }else {
            text.textContent = "Data Not Founded!";
            sayer.style.visibility = "hidden";
            source.style.visibility = "hidden";
            copyBtn.style.visibility = "hidden";
        }
        
        
        function NavigationBetweenHadith(navigateDirection = 1) {
            if (navigateDirection === -1 && storage.previousIndex === 0) return;
            if (navigateDirection ===  1 && storage.previousIndex === hadithList.length -1) return;
            if (navigateDirection !== 0 ) storage.previousIndex += (1 * navigateDirection);
            
            if (storage.previousIndex === 0) { priviousHadithBtn.style.visibility = "hidden";} else { priviousHadithBtn.style.visibility = "visible"; }
            if (storage.previousIndex === hadithList.length -1) { nextHadithBtn.style.visibility = "hidden";} else{ nextHadithBtn.style.visibility = "visible";}
            
            if (navigateDirection == null) return;
            if (hadithList.length == 0) return;
            
            if(hadithList[storage.previousIndex].includes("المصدر")) {
                text.textContent = hadithList[storage.previousIndex].substring(0, hadithList[storage.previousIndex].lastIndexOf("المصدر"));
                source.textContent = hadithList[storage.previousIndex].substring(hadithList[storage.previousIndex].lastIndexOf("المصدر"));
                source.style.visibility = "visible";
            }
            else {
                text.textContent = hadithList[storage.previousIndex];
                source.style.visibility = "hidden";
            }
            IncreaseSourceElementWidth(hadithList[storage.previousIndex].substring(hadithList[storage.previousIndex].lastIndexOf("المصدر")));
            updateStorage();
            
        }
        // current Hadith
        NavigationBetweenHadith(0);
        // Next Hadith
        nextHadithBtn.addEventListener("click",()=>{ NavigationBetweenHadith(1); });
        // Privious Hadith
        priviousHadithBtn.addEventListener("click",()=>{ NavigationBetweenHadith(-1); });
        // Copy To Clipboard
        copyBtn.addEventListener("click", ()=>{ copyToClipboard(hadithList[storage.previousIndex]) });
    }
    catch(err) {
        console.error("ERR", err.message);
    }
}
getJsonData();






function copyToClipboard(currentHadith) {
    let copyText = `${currentHadith}`;
    window.navigator.clipboard.writeText(copyText);
    alertMessage.style.visibility = "visible";
    setTimeout(()=>{ alertMessage.style.visibility = "hidden"; }, 1000);
}


function IncreaseSourceElementWidth(currentHadithSource) {
    if (currentHadithSource.length > 25) {
        document.getElementById('source').style.width = "70%";
    }else {
        document.getElementById('source').style.width = "auto";
    }
}


function goBack() {
    history.go(-1);
}
backBtn.addEventListener("click", goBack);
