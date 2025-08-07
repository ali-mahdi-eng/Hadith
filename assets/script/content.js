var sayer = document.getElementById('sayer');
var text = document.getElementById('text');
var source = document.getElementById('source');

var nextHadithBtn = document.getElementById('next-hadith-btn');
var priviousHadithBtn = document.getElementById('privious-hadith-btn');

var backBtn = document.getElementById('back-btn');
var copyBtn = document.getElementById('copy-btn');
var addToFavouritesBtn = document.getElementById('add-to-favourite-btn');
var alertMessage = document.getElementById('alert-message');



const storage = {
    section: getSection_or_SubjectFromURL("get_section"),
    subject: getSection_or_SubjectFromURL("get_subject"),
    previousIndex: JSON.parse(localStorage.getItem("storage"))?.[getSection_or_SubjectFromURL("get_section")]?.[getSection_or_SubjectFromURL("get_subject")] || 0,
    dataSaved: JSON.parse(localStorage.getItem("storage")) || null,
}






function getSection_or_SubjectFromURL(data_required) {
    let params = new URLSearchParams(window.location.search);
    let currentSection = params.get("section");
    let currentSubject = params.get("subject");
    document.querySelector("title").textContent = currentSection + "/" + currentSubject;
    if (data_required === "get_section") return currentSection;
    if (data_required === "get_subject") return currentSubject;
    // default value
    return null;
}


function updateStorage() {
    let temp = (storage.dataSaved) ? (storage.dataSaved) : ({});
    temp[storage.section] = temp[storage.section] || {};
    temp[storage.section][storage.subject] = storage.previousIndex;
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






async function getJsonDataFromAPI() {
    let url = "./data/hadith.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`response status: ${response.status}`);
        }
        const data = await response.json();
        handleData(data);
    }
    catch (err) {
        console.error("ERR:", err.static, err.message)
    }
    
    
    function handleData(data) {
        var hadithList = data[storage.section][storage.subject];
        console.log(`>> Home/${storage.section}/${storage.subject}/${storage.previousIndex}`);

        // Hide/Show [sayer & source] If There is no data found.
        if (hadithList.length > 0) {
            sayer.style.visibility = "visible";
            source.style.visibility = "visible";
        }else {
            text.textContent = "Data Not Found!";
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
            
            sayer.textContent = hadithList[storage.previousIndex].sayer;
            text.textContent = hadithList[storage.previousIndex].text;
            source.textContent = hadithList[storage.previousIndex].source;
            
            IncreaseSourceElementWidth(hadithList[storage.previousIndex]);
            updateStorage();
            isFavourited(storage.previousIndex);
        }
        // current Hadith
        NavigationBetweenHadith(0);
        // Next Hadith
        nextHadithBtn.addEventListener("click",()=>{ NavigationBetweenHadith(1); });
        // Privious Hadith
        priviousHadithBtn.addEventListener("click",()=>{ NavigationBetweenHadith(-1); });
        // Copy To Clipboard
        copyBtn.addEventListener("click", ()=>{ copyToClipboard(hadithList[storage.previousIndex]) });
        // Add To Favourites
        addToFavouritesBtn.addEventListener("click", ()=>{ addToFavourites(hadithList[storage.previousIndex]) });
    
        // document.querySelector("title").textContent = storage.subject;
    }
}
getJsonDataFromAPI();




function copyToClipboard(currentHadith) {
    let copyText = `${currentHadith.sayer}: \n ${currentHadith.text} \n \n #${currentHadith.source}`;
    window.navigator.clipboard.writeText(copyText);
    alertMessage.textContent = "تم نسخ النص";
    alertMessage.style.visibility = "visible";
    setTimeout(()=>{ alertMessage.style.visibility = "hidden"; }, 1000);
}

function addToFavourites(currentHadith) {
    let favouritesStorage = {};
    if (JSON.parse(localStorage.getItem("favourites_storage"))) {
        favouritesStorage = JSON.parse(localStorage.getItem("favourites_storage"));
    }
    
    if (isFavourited(storage.previousIndex)) {
        // Remove From favourites
        delete favouritesStorage[`${storage.section}-${storage.subject}-${storage.previousIndex}`];
        localStorage.setItem("favourites_storage", JSON.stringify(favouritesStorage));
        
        alertMessage.textContent = "تم إزالة الحديث";
        alertMessage.style.visibility = "visible";
        setTimeout(()=>{ alertMessage.style.visibility = "hidden"; }, 1000);
    }
    else {
        // Add To favourites
        favouritesStorage[`${storage.section}-${storage.subject}-${storage.previousIndex}`] = {
            index: storage.previousIndex,
            sayer: currentHadith.sayer,
            text: currentHadith.text,
            source: currentHadith.source
        }
        localStorage.setItem("favourites_storage", JSON.stringify(favouritesStorage));
        
        alertMessage.textContent = "تم حفظ الحديث";
        alertMessage.style.visibility = "visible";
        setTimeout(()=>{ alertMessage.style.visibility = "hidden"; }, 1000);
    }
    isFavourited(storage.previousIndex);
}


function isFavourited(currentIndex) {
    if (!currentIndex || (JSON.parse(localStorage.getItem("favourites_storage")) == undefined)) return;
    document.querySelector("#add-to-favourite-btn svg").classList.remove("favourited");
    let isAddedToFavourite = (JSON.parse(localStorage.getItem("favourites_storage"))[`${storage.section}-${storage.subject}-${currentIndex}`]) ? true : false;
    if (isAddedToFavourite) {
        document.querySelector("#add-to-favourite-btn svg").classList.add("favourited");
    }
    return isAddedToFavourite;
}


function IncreaseSourceElementWidth(currentHadith) {
    if (currentHadith.source.length > 15) {
        document.getElementById('source').style.width = "70%";
    }else {
        document.getElementById('source').style.width = "auto";
    }
}

function goBack() {
    history.go(-1);
}
backBtn.addEventListener("click", goBack);


