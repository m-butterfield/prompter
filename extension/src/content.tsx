import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { Main } from "Main";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { makeTheme } from "theme";
import { MODAL_OPEN, setGlobalModalOpen } from "utils";

const stopKeyEvents = (e: KeyboardEvent) => {
  if (MODAL_OPEN) {
    e.stopImmediatePropagation();
  }
};

document.addEventListener("keydown", stopKeyEvents);
document.addEventListener("keypress", stopKeyEvents);

chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) =>
  openModal(request.appURL, request.selectionText)
);

window.addEventListener("message", (event) => {
  if (event.source !== window) {
    return;
  }

  if (event.data.type === "prompter-query-token") {
    chrome.storage.sync.set({ queryToken: event.data.token });
  }
});

const openModal = (appURL: string, selectionText: string) => {
  setGlobalModalOpen(true);

  const root = document.createElement("div");
  const shadowRoot = root.attachShadow({ mode: "open" });
  document.body.appendChild(root);

  const styleElement = document.createElement("style");
  const shadowRootElement = document.createElement("div");
  shadowRoot.appendChild(styleElement);
  shadowRoot.appendChild(shadowRootElement);

  const cache = createCache({
    key: "css",
    prepend: true,
    container: styleElement,
  });

  const theme = makeTheme(shadowRootElement);

  createRoot(shadowRootElement).render(
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <Main appURL={appURL} selectionText={selectionText} />
      </ThemeProvider>
    </CacheProvider>
  );
};
