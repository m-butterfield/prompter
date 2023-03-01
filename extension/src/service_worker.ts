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

let appURL = "";

chrome.management.getSelf((result) => {
  if (result.installType === "development") {
    appURL = "http://localhost:8000";
  } else {
    appURL = "https://getprompter.app";
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "prompter" || info.menuItemId === "prompter-copy") {
    const selectionText = info.selectionText;
    chrome.storage.sync.get("queryToken", (result) => {
      chrome.tabs.sendMessage(tab.id, {
        appURL,
        selectionText: selectionText ? selectionText : "",
        queryToken: result.queryToken || "",
      });
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "open_modal") {
    chrome.storage.sync.get("queryToken", (result) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          appURL,
          selectionText: "",
          queryToken: result.queryToken || "",
        });
      });
    });
  }
});
