let clickedEl: HTMLInputElement | null = null;

document.addEventListener(
  "contextmenu",
  (event) => (clickedEl = event.target as HTMLInputElement),
  true
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const result = prompt("Enter prompt for ChatGPT to generate text:");
  if (clickedEl && result) {
    clickedEl.value = result;
  }
});
