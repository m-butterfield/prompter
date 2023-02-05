chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "prompter",
    title: "Add prompted text",
    type: "normal",
    contexts: ["editable"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "prompter") {
    console.log("prompter clicked");
  }
});
