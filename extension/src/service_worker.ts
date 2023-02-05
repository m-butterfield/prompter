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
    apiURL = "http://localhost:8000";
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "prompter") {
    chrome.tabs.sendMessage(tab.id, { apiURL });
  }
});
