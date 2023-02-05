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
    fetch(`${apiURL}/graphql`, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        operationName: "tryChat",
        variables: { prompt: result },
        query:
          "query tryChat($prompt: String!) {\n  chat(prompt: $prompt)\n}\n",
      }),
    })
      .then((resp) => resp.json())
      .then((text) => {
        clickedEl.value = text.data.chat;
      });
  }
});
