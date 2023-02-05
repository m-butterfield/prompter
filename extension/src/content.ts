let clickedEl: HTMLInputElement | null = null;

document.addEventListener(
  "contextmenu",
  (event) => (clickedEl = event.target as HTMLInputElement),
  true
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const result = prompt("Enter prompt for ChatGPT to generate text:");
  const apiURL = request.apiURL;
  if (clickedEl && result) {
    clickedEl.value = result;
  }
});
