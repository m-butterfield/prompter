chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "prompter",
    title: "Add prompted text",
    type: "normal",
    contexts: ["editable"],
  });
});

let apiURL = "";

chrome.management.getSelf((result) => {
  if (result.installType === "development") {
    apiURL = "http://localhost:3000";
  } else {
    apiURL = "https://prompter-6wg57m4u3a-uc.a.run.app";
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "prompter") {
    chrome.tabs.sendMessage(tab.id, { apiURL });
  }
});
