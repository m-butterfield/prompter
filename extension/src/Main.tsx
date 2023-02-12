import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import { PrompterDialogContent } from "PrompterDialogContent";
import React, { useEffect, useRef, useState } from "react";
import { setGlobalModalOpen } from "utils";

type MainProps = {
  appURL: string;
  selectionText: string;
};

export const Main = ({ appURL, selectionText }: MainProps) => {
  const [modalOpen, setModalOpen] = useState(true);
  const [promptInput, setPromptInput] = useState(selectionText);
  const [loading, setLoading] = useState(false);
  const [promptResult, setPromptResult] = useState("");
  const copyButtonRef = useRef<HTMLButtonElement>();
  const [queryToken, setQueryToken] = useState();

  useEffect(() => {
    chrome.storage.sync.get("queryToken", (result) => {
      setQueryToken(result.queryToken || "");
    });
  }, []);

  const getResponse = () => {
    setLoading(true);
    setPromptResult("");
    const source = new EventSource(
      `${appURL}/chat?p=${encodeURIComponent(promptInput)}&t=${queryToken}`
    );
    let result = "";
    source.onmessage = (event) => {
      const msg = event.data.replace(/^"(.*)"$/s, "$1"); // somehow leading whitespace was being stripped from the messages returned, so they are wrapped in quotes now on the BE
      // skip leading spaces
      if (result === "" && msg === "\n") {
        return;
      }
      result += msg;
      setPromptResult(result);
    };
    source.onerror = (event) => {
      if (event.eventPhase == EventSource.CLOSED) {
        setLoading(false);
        copyButtonRef.current.focus();
        source.close();
      } else {
        setPromptResult("Error, please try again later...");
      }
    };
  };

  // hack to ensure input has focus since we are in a shadow dom, see inputRef on TextField below
  const inputRef = useRef<HTMLInputElement>();
  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current.focus();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={modalOpen}
      onClose={() => {
        setGlobalModalOpen(false);
        setModalOpen(false);
      }}
    >
      <DialogContent>
        <Stack direction="column" spacing={2} width="100%" m="auto">
          <PrompterDialogContent
            inputRef={inputRef}
            copyButtonRef={copyButtonRef}
            loading={loading}
            promptInput={promptInput}
            setPromptInput={setPromptInput}
            promptResult={promptResult}
            getResponse={getResponse}
            setModalOpen={setModalOpen}
            queryToken={queryToken}
            appURL={appURL}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
