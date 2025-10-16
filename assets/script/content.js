let sayer = document.getElementById('sayer');
let text = document.getElementById('text');
let source = document.getElementById('source');

const nextHadithBtn = document.getElementById('next-hadith-btn');
const priviousHadithBtn = document.getElementById('privious-hadith-btn');

const backBtn = document.getElementById('back-btn');
const copyBtn = document.getElementById('copy-btn');
const addToFavouritesBtn = document.getElementById('add-to-favourite-btn');
const shareBtn = document.getElementById('share-btn');
const alertMessage = document.getElementById('alert-message');



// Don't Delete Tutorial, will added as first element in data array.
const tutorial = {
    "sayer": "التنقل بين النصوص",
    "text": "للإنتقال الى النص التالي إضغط الحافة اليمنى للشاشة، للرجوع الى النص السابق إضغط الحافة اليسرى للشاشة.",
    "source": "التعليمات"
}



const storage = {
    section: getSection_or_SubjectFromURL("get_section"),
    subject: getSection_or_SubjectFromURL("get_subject"),
    currentIndex: JSON.parse(localStorage.getItem("storage"))?.[getSection_or_SubjectFromURL("get_section")]?.[getSection_or_SubjectFromURL("get_subject")] || 0,
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
    temp[storage.section][storage.subject] = storage.currentIndex;
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
        if (!response.ok) { throw new Error(`response status: ${response.status}`); }
        const data = await response.json();
        handleData(data);
    }
    catch(err) {
        console.error("ERR:", err.static, err.message)
    }
    
    
    function handleData(data) {
        var hadithList = data[storage.section][storage.subject];
        // Hide/Show [sayer & source] If There is no data found.
        if (hadithList.length > 0) {
            // Add tutorial to data array
            hadithList.unshift(tutorial);
            sayer.style.visibility = "visible";
            source.style.visibility = "visible";
            copyBtn.style.visibility = "visible";
            addToFavouritesBtn.style.visibility = "visible";
        }else {
            text.textContent = "Data Not Found!";
            sayer.style.visibility = "hidden";
            source.style.visibility = "hidden";
            copyBtn.style.visibility = "hidden";
            addToFavouritesBtn.style.visibility = "hidden";
        }
        
        // Display current hadith
        NavigationBetweenHadith(0);
        // Next Hadith
        nextHadithBtn.addEventListener("click",()=>{ NavigationBetweenHadith(1); });
        // Privious Hadith
        priviousHadithBtn.addEventListener("click",()=>{ NavigationBetweenHadith(-1); });
        // Copy To Clipboard
        copyBtn.addEventListener("click", ()=>{ copyToClipboard(hadithList[storage.currentIndex]) });
        // Add To Favourites
        addToFavouritesBtn.addEventListener("click", ()=>{ addToFavourites(hadithList[storage.currentIndex]) });
        // Share Hadith
        if (navigator.share) {
            shareBtn.style.visibility = 'visible'; // Hide the button if not supported
            shareBtn.addEventListener('click',()=>{ shareHadith(hadithList[storage.currentIndex]) });
        } else {
            // Fallback for browsers that don't support the Web Share API
            shareBtn.style.visibility = 'hidden'; // Hide the button if not supported
            console.warn('warning: Web Share API not supported in this browser.');
        }
        
        // Handle Navigation Buttons
        function NavigationBetweenHadith(navigateDirection = 1) {
            if (navigateDirection === -1 && storage.currentIndex === 0) return;
            if (navigateDirection ===  1 && storage.currentIndex === hadithList.length -1) return;
            if (navigateDirection !== 0 ) storage.currentIndex += (1 * navigateDirection); // (1 * +1) OR (1 * -1)
            
            if (storage.currentIndex === 0) { priviousHadithBtn.style.visibility = "hidden";} else { priviousHadithBtn.style.visibility = "visible"; }
            if (storage.currentIndex === hadithList.length -1) { nextHadithBtn.style.visibility = "hidden";} else{ nextHadithBtn.style.visibility = "visible";}
            
            if (hadithList.length == 0) return;
            sayer.textContent = hadithList[storage.currentIndex].sayer;
            text.textContent = hadithList[storage.currentIndex].text;
            source.textContent = hadithList[storage.currentIndex].source;
            IncreaseSourceElementWidth(hadithList[storage.currentIndex]);
            
            isFavourited(storage.currentIndex);
            updateStorage();
        }
    }
}
getJsonDataFromAPI();




async function shareHadith(hadith) {
    try {
        await navigator.share({
            text: `${hadith.sayer}: \n ${hadith.text} \n\n المصدر: ${hadith.source}`,
        });
        console.log('Content shared successfully');
    } catch (error) {
        console.error('Error sharing:', error);
    }
}



function copyToClipboard(currentHadith) {
    let sourcePrefix = "المصدر: ";
    let copyText = `${currentHadith.sayer}: \n ${currentHadith.text} \n\n ${sourcePrefix}${currentHadith.source}`;
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
    
    if (isFavourited(storage.currentIndex)) {
        // Remove From favourites
        delete favouritesStorage[`${storage.section}-${storage.subject}-${storage.currentIndex}`];
        localStorage.setItem("favourites_storage", JSON.stringify(favouritesStorage));
        
        alertMessage.textContent = "تم إزالة الحديث";
        alertMessage.style.visibility = "visible";
        setTimeout(()=>{ alertMessage.style.visibility = "hidden"; }, 1000);
    }
    else {
        // Add To favourites
        favouritesStorage[`${storage.section}-${storage.subject}-${storage.currentIndex}`] = {
            index: storage.currentIndex,
            sayer: currentHadith.sayer,
            text: currentHadith.text,
            source: currentHadith.source
        }
        localStorage.setItem("favourites_storage", JSON.stringify(favouritesStorage));
        
        alertMessage.textContent = "تم حفظ الحديث";
        alertMessage.style.visibility = "visible";
        setTimeout(()=>{ alertMessage.style.visibility = "hidden"; }, 1000);
    }
    isFavourited(storage.currentIndex);
}


function isFavourited(currentIndex) {
    if (((currentIndex !== 0) && (!currentIndex)) || (JSON.parse(localStorage.getItem("favourites_storage")) == undefined)) return;
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


