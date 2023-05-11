window.addEventListener("DOMContentLoaded", () => {
  //prettier-ignore
  const autosaver_toggle = document.getElementById("autosaver_toggle") as HTMLInputElement;
  //prettier-ignore
  const update_interval_input = document.getElementById("update_interval") as HTMLInputElement;
  //prettier-ignore
  const ghost_mode_toggle = document.getElementById("ghost_mode_toggle") as HTMLInputElement;
  //prettier-ignore
  const telegram_bot_toggle = document.getElementById("telegram_bot_toggle") as HTMLInputElement;
  //prettier-ignore
  const telegram_token_input = document.getElementById("telegram_token") as HTMLInputElement;
  //prettier-ignore
  const telegram_chat_id_input = document.getElementById("telegram_chat_id") as HTMLInputElement;
  //prettier-ignore
  const save_options_btn = document.getElementById("save_options") as HTMLButtonElement;
  //prettier-ignore
  const reset_history_btn = document.getElementById("reset_history_storage") as HTMLButtonElement;

  const defaultSettings: Settings = {
    autosaver: true,
    interval: 30,
    ghostMode: false,
    telegramBotState: false,
    telegramToken: "",
    telegramChatId: "",
  };

  const hideTelegramInputs = () => {
    //prettier-ignore
    document.getElementById("telegram_hidden_toggle_1")?.classList.add("hidden");
    //prettier-ignore
    document.getElementById("telegram_hidden_toggle_2")?.classList.add("hidden");
  };
  const showTelegramInputs = () => {
    //prettier-ignore
    document.getElementById("telegram_hidden_toggle_1")?.classList.remove("hidden");
    //prettier-ignore
    document.getElementById("telegram_hidden_toggle_2")?.classList.remove("hidden");
  };

  const applySettingsToUi = (savedSettings: Settings | undefined) => {
    console.log(" ~ savedSettings:", savedSettings);
    if (savedSettings) {
      autosaver_toggle.checked = savedSettings.autosaver;
      update_interval_input.value = String(savedSettings.interval);
      ghost_mode_toggle.checked = savedSettings.ghostMode;
      telegram_bot_toggle.checked = savedSettings.telegramBotState;
      telegram_token_input.value = savedSettings.telegramToken;
      telegram_chat_id_input.value = savedSettings.telegramChatId;
    } else {
      chrome.storage.local.set({ savedSettings: defaultSettings });
    }

    telegram_bot_toggle.checked ? showTelegramInputs() : hideTelegramInputs();
  };

  const saveOptionToStorage = () => {
    if (!update_interval_input.checkValidity()) {
      update_interval_input.reportValidity();
      return;
    }

    if (
      telegram_bot_toggle.checked &&
      (!telegram_token_input.checkValidity() ||
        !telegram_chat_id_input.checkValidity())
    ) {
      telegram_chat_id_input.reportValidity();
      telegram_token_input.reportValidity();
      return;
    }

    const newSettings = {
      autosaver: autosaver_toggle.checked,
      interval: parseInt(update_interval_input.value),
      ghostMode: ghost_mode_toggle.checked,
      telegramBotState: telegram_bot_toggle.checked,
      telegramToken: telegram_token_input.value,
      telegramChatId: telegram_chat_id_input.value,
    };

    chrome.storage.local.set({ savedSettings: newSettings }, () => {
      // TODO: enable when updating background script
      // chrome.runtime.sendMessage({ command: "updateSettings" });
    });
    window.close();
  };

  telegram_bot_toggle.addEventListener("change", (event) =>
    (<HTMLInputElement>event.target).checked
      ? showTelegramInputs()
      : hideTelegramInputs()
  );

  reset_history_btn.addEventListener("click", () => {
    // TODO remove the not used one
    chrome.storage.local.remove("targetLasts");
    chrome.storage.local.remove("targetNotifyLasts");
  });

  chrome.storage.local.get({ savedSettings: {} }, (data) =>
    applySettingsToUi(data.savedSettings as Settings)
  );

  save_options_btn.addEventListener("click", saveOptionToStorage, false);

  chrome.storage.local.onChanged.addListener((changes) =>
    console.log("[STORAGE]: ", changes)
  );
});
