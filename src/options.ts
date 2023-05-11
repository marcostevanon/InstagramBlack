//prettier-ignore
const autosaver_toggle = document.getElementById("autosaver_toggle")! as HTMLInputElement;
//prettier-ignore
const update_internal_input = document.getElementById("update_internal")! as HTMLInputElement;
//prettier-ignore
const ghost_mode_toggle = document.getElementById("ghost_mode_toggle")! as HTMLInputElement;
//prettier-ignore
const telegram_bot_toggle = document.getElementById("telegram_bot_toggle")! as HTMLInputElement;
//prettier-ignore
const telegram_token_input = document.getElementById("telegram_token")! as HTMLInputElement;
//prettier-ignore
const telegram_chat_id_input = document.getElementById("telegram_chat_id")! as HTMLInputElement;
//prettier-ignore
const reset_history_btn = document.getElementById("reset_history_storage")! as HTMLButtonElement;
//prettier-ignore
const save_options_btn = document.getElementById("save_options")! as HTMLButtonElement;

const defaultSettings: Settings = {
  autosaver: true,
  interval: 30,
  ghostMode: false,
  telegramBotState: false,
  telegramToken: "",
  telegramChatId: "",
};

const applySettingsToUi = (savedSettings: Settings) => {
  console.log("applySettingsToUi ~ savedSettings:", savedSettings);
  if (!savedSettings) {
    chrome.storage.local.set({ savedSettings: defaultSettings });
    return;
  }

  autosaver_toggle.checked = savedSettings.autosaver;
  update_internal_input.value = String(savedSettings.interval);
  ghost_mode_toggle.checked = savedSettings.ghostMode;

  telegram_bot_toggle.checked = savedSettings.telegramBotState;
  telegram_token_input.value = savedSettings.telegramToken;
  telegram_chat_id_input.value = savedSettings.telegramChatId;

  if (telegram_bot_toggle.checked) {
    let x = document.getElementsByClassName("bot");
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("hidden");
    }
  }
};
const saveOptionToStorage = () => {
  if (update_internal_input.checkValidity() && !telegram_bot_toggle.checked) {
    const newSettings = {
      autosaver: autosaver_toggle.checked,
      interval: update_internal_input.value,
      ghostMode: ghost_mode_toggle.checked,
      telegramBotState: telegram_bot_toggle.checked,
      telegramToken: telegram_token_input.value,
      telegramChatId: telegram_chat_id_input.value,
    };

    chrome.storage.local.set({ savedSettings: newSettings }, () =>
      chrome.runtime.sendMessage({ command: "updateSettings" })
    );
    window.close();
  } else if (
    update_internal_input.checkValidity() &&
    telegram_bot_toggle.checked &&
    telegram_token_input.checkValidity() &&
    telegram_chat_id_input.checkValidity()
  ) {
    const newSettings = {
      autosaver: autosaver_toggle.checked,
      interval: update_internal_input.value,
      ghostMode: ghost_mode_toggle.checked,
      telegramBotState: telegram_bot_toggle.checked,
      telegramToken: telegram_token_input.value,
      telegramChatId: telegram_chat_id_input.value,
    };

    chrome.storage.local.set({ savedSettings: newSettings }, () =>
      chrome.runtime.sendMessage({ command: "updateSettings" })
    );
    window.close();
  } else {
    telegram_chat_id_input.reportValidity();
    telegram_token_input.reportValidity();
    update_internal_input.reportValidity();
  }
};

const hideTelegramInputs = () => {
  let x = document.getElementsByClassName("bot");
  for (let i = 0; i < x.length; i++) {
    x[i].classList.remove("hidden");
  }
};
const showTelegramInputs = () => {
  let x = document.getElementsByClassName("bot");
  for (let i = 0; i < x.length; i++) {
    x[i].classList.add("hidden");
  }
};

// chrome.storage.local.get({ savedSettings: [] }, (data) =>
//   applySettingsToUi(data.savedSettings as Settings)
// );

telegram_bot_toggle.addEventListener("change", (event) =>
  (<HTMLInputElement>event.target).checked
    ? hideTelegramInputs()
    : showTelegramInputs()
);

reset_history_btn.addEventListener("click", () => {
  // TODO remove the not used one
  chrome.storage.local.remove("targetLasts");
  chrome.storage.local.remove("targetNotifyLasts");
});

save_options_btn.addEventListener("click", saveOptionToStorage, false);
