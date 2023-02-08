chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  openModal();
  // const result = prompt("Enter prompt for ChatGPT to generate text:");
  // const apiURL = request.apiURL;
  // if (result) {
  //   fetch(`${apiURL}/graphql`, {
  //     method: "POST",
  //     headers: new Headers({ "Content-Type": "application/json" }),
  //     body: JSON.stringify({
  //       operationName: "tryChat",
  //       variables: { prompt: result },
  //       query:
  //         "query tryChat($prompt: String!) {\n  chat(prompt: $prompt)\n}\n",
  //     }),
  //   })
  //     .then((resp) => resp.json())
  //     .then((text) => {
  //       console.log(text.data.chat);
  //     });
  // }
});

const openModal = () => {
  const shadowWrapper = document.createElement("div");
  shadowWrapper.id = "prompter-wrapper";
  shadowWrapper.setAttribute(
    "style",
    `
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);
  `
  );
  const shadowRoot = shadowWrapper.attachShadow({ mode: "open" });

  const modal = document.createElement("div");
  modal.setAttribute(
    "style",
    `
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  `
  );
  modal.innerHTML = `
    <label>Input prompt:</label><input />
    <input type="submit" />
  `;
  shadowRoot.appendChild(modal);

  document.body.appendChild(shadowWrapper);
};
