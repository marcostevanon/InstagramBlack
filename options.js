let settings;

let autosaverToggle = document.getElementById("autosaverToggle");
let intervalInput = document.getElementById("interval");
let ghostModeToggle = document.getElementById("ghostModeToggle");
let telegramBotToggle = document.getElementById('telegramBotToggle');
let telegramTokenInput = document.getElementById('telegramToken');
let telegramChatIdInput = document.getElementById('telegramChatId');
let telegramNotifyToggle = document.getElementById('telegramNotifyToggle');

chrome.storage.local.get({ 'savedSettings': [] }, function(data) {
    settings = data.savedSettings;

    if (settings.interval) {
        autosaverToggle.checked = settings.autosaver;
        intervalInput.value = settings.interval;
        ghostModeToggle.checked = settings.ghostMode;

        telegramBotToggle.checked = settings.telegramBotState;
        telegramNotifyToggle.checked = settings.telegramNotifyState;
        telegramTokenInput.value = settings.telegramToken;
        telegramChatIdInput.value = settings.telegramChatId;

        if(telegramBotToggle.checked){
            let x = document.getElementsByClassName("bot");
            for (let i = 0; i < x.length; i++) {
                x[i].classList.remove("hidden");
            }
        }

    }else{
        settings = {autosaver:true, interval:"30", ghostMode:false, telegramBotState:false, telegramToken:"", telegramChatId:""}; // default settings
        chrome.storage.local.set({'savedSettings': settings}, function() {
            //console.log("done.");
        });
    }
});


telegramBotToggle.addEventListener('change', (event) => {
    if (event.target.checked) {

        let x = document.getElementsByClassName("bot");
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("hidden");
        }

    } else {
        telegramNotifyToggle.checked = false;
        let x = document.getElementsByClassName("bot");
        for (let i = 0; i < x.length; i++) {
            x[i].classList.add("hidden");
        }
    }
})

document.getElementById("clearAutosaveStorage").addEventListener('click', function() {
    chrome.storage.local.remove('targetLasts');
});

document.getElementById("clearNotifyStorage").addEventListener('click', function() {
    chrome.storage.local.remove('targetNotifyLasts');
});

let saveBtn = document.getElementById("saveOptions");
saveBtn.addEventListener('click', function() {

    if(intervalInput.checkValidity() && !telegramBotToggle.checked){
        settings = {autosaver:autosaverToggle.checked, interval:intervalInput.value, ghostMode:ghostModeToggle.checked, telegramBotState:telegramBotToggle.checked, telegramToken:telegramTokenInput.value, 
                    telegramChatId:telegramChatIdInput.value, telegramNotifyState:telegramNotifyToggle.checked};

        chrome.storage.local.set({'savedSettings': settings}, function() {
            //console.log("saved.");
            chrome.runtime.sendMessage({command: "updateSettings"}, function(response) {
                //console.log(response.ok);
            });
        });
        window.close();
    }else if(intervalInput.checkValidity() && telegramBotToggle.checked && telegramTokenInput.checkValidity() && telegramChatIdInput.checkValidity()){

        settings = {autosaver:autosaverToggle.checked, interval:intervalInput.value, ghostMode:ghostModeToggle.checked, telegramBotState:telegramBotToggle.checked, telegramToken:telegramTokenInput.value, 
                    telegramChatId:telegramChatIdInput.value, telegramNotifyState:telegramNotifyToggle.checked};

        chrome.storage.local.set({'savedSettings': settings}, function() {
            //console.log("saved.");
            chrome.runtime.sendMessage({command: "updateSettings"}, function(response) {
                //console.log(response.ok);
            });
        });
        window.close();

    }else{
        telegramChatIdInput.reportValidity();
        telegramTokenInput.reportValidity();
        intervalInput.reportValidity();
    }

}, false);
