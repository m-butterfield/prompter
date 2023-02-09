chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "prompter",
    title: "Open Prompter",
    type: "normal",
    contexts: ["editable"],
  });
  chrome.contextMenus.create({
    id: "prompter-copy",
    title: "Copy to Prompter Input",
    type: "normal",
    contexts: ["selection"],
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
  debugger;
  if (info.menuItemId === "prompter" || info.menuItemId === "prompter-copy") {
    const selectionText = info.selectionText;
    chrome.tabs.sendMessage(tab.id, {
      apiURL,
      selectionText: selectionText ? selectionText : "",
    });
  }
});
