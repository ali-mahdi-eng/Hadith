let sayer = document.getElementById('sayer');
let text = document.getElementById('text');
let source = document.getElementById('source');

let navigation = document.querySelector("#navigation");
let nextHadithBtn = document.getElementById('next-hadith-btn');
let priviousHadithBtn = document.getElementById('privious-hadith-btn');

let backBtn = document.getElementById('back-btn');
let copyBtn = document.getElementById('copy-btn');
let addToFavouritesBtn = document.getElementById('add-to-favourite-btn');
let alertMessage = document.getElementById('alert-message');


document.querySelector("title").textContent = "المحفوظات";


let data = JSON.parse(localStorage.getItem("favourites_storage")) || null;

if (data && Object.keys(data).length >= 1) {
    handlefavourites(data);
}
else {
    // Add Some Default Behaviour (no data).
    addToFavouritesBtn.style.visibility = "hidden";
    copyBtn.style.visibility = "hidden";
    navigation.style.visibility = "hidden";
}





function handlefavourites(data) {
    let hadithList = Object.entries(data);
    let hadithIndex = 0;
    
    function NavigationBetweenHadith(navigateDirection = 1) {
        if (navigateDirection === -1 && hadithIndex === 0) return;
        if (navigateDirection ===  1 && hadithIndex === hadithList.length -1) return;
        if (navigateDirection !== 0 ) hadithIndex += (1 * navigateDirection);
        
        if (hadithIndex === 0) { priviousHadithBtn.style.visibility = "hidden";} else { priviousHadithBtn.style.visibility = "visible"; }
        if (hadithIndex === hadithList.length -1) { nextHadithBtn.style.visibility = "hidden";} else{ nextHadithBtn.style.visibility = "visible";}
        
        if (navigateDirection == null) return;
        if (hadithList.length == 0) return;
        
        sayer.textContent = hadithList[hadithIndex][1].sayer;
        text.textContent = hadithList[hadithIndex][1].text;
        source.textContent = hadithList[hadithIndex][1].source;
        IncreaseSourceElementWidth(hadithList[hadithIndex][1]);
        isFavourited(hadithList[hadithIndex][0]);
        document.querySelector("title").textContent = hadithList[hadithIndex][0].replaceAll("-", "/");
    }
    // current Hadith
    NavigationBetweenHadith(0);
    // Next Hadith
    nextHadithBtn.addEventListener("click",()=>{ NavigationBetweenHadith(1); });
    // Privious Hadith
    priviousHadithBtn.addEventListener("click",()=>{ NavigationBetweenHadith(-1); });
    // Copy To Clipboard
    copyBtn.addEventListener("click", ()=>{ copyToClipboard(hadithList[hadithIndex][1]) });
    // Add To Favourites
    addToFavouritesBtn.addEventListener("click", ()=>{ addToFavourites(hadithList[hadithIndex][0]) });
}






function copyToClipboard(currentHadith) {
    let copyText = `${currentHadith.sayer}: \n ${currentHadith.text} \n \n #${currentHadith.source}`;
    window.navigator.clipboard.writeText(copyText);
    alertMessage.textContent = "تم نسخ النص";
    alertMessage.style.visibility = "visible";
    setTimeout(()=>{ alertMessage.style.visibility = "hidden"; }, 1000);
}


function addToFavourites(currentHadithId) {
    let favouritesStorage = {};
    if (JSON.parse(localStorage.getItem("favourites_storage"))) {
        favouritesStorage = JSON.parse(localStorage.getItem("favourites_storage"));
    }
    
    if (isFavourited(currentHadithId)) {
        // Remove From favourites:
        delete favouritesStorage[currentHadithId];
        localStorage.setItem("favourites_storage", JSON.stringify(favouritesStorage));
        
        alertMessage.textContent = "تم إزالة الحديث";
        alertMessage.style.visibility = "visible";
        setTimeout(()=>{ alertMessage.style.visibility = "hidden"; }, 1000);
    }
    else {
        // Add To favourites
        favouritesStorage[currentHadithId] = {
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
    isFavourited(currentHadithId);
}


function isFavourited(currentHadithId) {
    if (!currentHadithId || (JSON.parse(localStorage.getItem("favourites_storage")) == undefined)) return;
    document.querySelector("#add-to-favourite-btn svg").classList.remove("favourited");
    let isAddedToFavourite = (JSON.parse(localStorage.getItem("favourites_storage"))[currentHadithId]) ? true : false;
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