let name = document.getElementById('duaa-name');
let text = document.getElementById('duaa-text');
let source = document.getElementById('duaa-source');

let backBtn = document.getElementById('back-btn');
let copyBtn = document.getElementById('copy-btn');
let shareBtn = document.getElementById('share-btn');
let alertMessage = document.getElementById('alert-message');



function getSectionNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    const selectedSection = params.get("section");
    return selectedSection;
}

function getSubjectNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    const selectedSubject = params.get("subject");
    document.querySelector("title").textContent = selectedSubject;
    return selectedSubject;
}

function getSubjectIndexFromURL() {
    const params = new URLSearchParams(window.location.search);
    const selectedSubjectIndex = params.get("index");
    return selectedSubjectIndex;
}







async function getDataFromJson() {
    const dataSource = getSectionNameFromURL();
    const url = `./data/${dataSource}.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) { throw new Error(`response status: ${response.status}`); }
        const data = await response.json();
        let subject = data[getSectionNameFromURL()][getSubjectIndexFromURL()];
        handleDuaa(subject);
        if (getSectionNameFromURL() === "zyarat") {
            document.querySelector('#duaa-name').style.fontSize = "1.7rem";
            document.querySelector('#duaa').style.gap = "50px";
        }
    }
    catch(err) { console.error("ERR:", err.static, err.message) }
}
getDataFromJson();




function handleDuaa(duaa) {
    copyBtn.style.visibility = "visible";
    name.textContent = duaa.name;
    text.textContent = duaa.text;
    source.textContent = duaa.source;
    // Copy To Clipboard
    copyBtn.addEventListener("click", ()=>{ copyToClipboard(duaa) });
    // Share Duaa
    if (navigator.share) {
        shareBtn.style.visibility = 'visible'; // Hide the button if not supported
        shareBtn.addEventListener('click',()=>{ shareDuaa(duaa) });
    } else {
        // Fallback for browsers that don't support the Web Share API
        shareBtn.style.visibility = 'hidden'; // Hide the button if not supported
        console.warn('warning: Web Share API not supported in this browser.');
    }
}




async function shareDuaa(duaa) {
    try {
        await navigator.share({
            text: `${duaa.name}: \n ${duaa.text}`,
        });
        console.log('Content shared successfully');
    } catch (error) {
        console.error('Error sharing:', error);
    }
}



function copyToClipboard(duaa) {
    let copyText = `${duaa.name}: \n ${duaa.text}`;
    window.navigator.clipboard.writeText(copyText);
    alertMessage.textContent = "تم نسخ النص";
    alertMessage.style.visibility = "visible";
    setTimeout(()=>{ alertMessage.style.visibility = "hidden"; }, 1000);
}



function goBack() {
    history.go(-1);
}
backBtn.addEventListener("click", goBack);

