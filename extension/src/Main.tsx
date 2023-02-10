import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import React, { useEffect, useRef, useState } from "react";
import { setGlobalModalOpen } from "utils";

type MainProps = {
  apiURL: string;
  selectionText: string;
};

export const Main = ({ apiURL, selectionText }: MainProps) => {
  const [modalOpen, setModalOpen] = useState(true);
  const [promptInput, setPromptInput] = useState(selectionText);
  const [error, setError] = useState("");
  const maxLength = 4096;
  const [loading, setLoading] = useState(false);
  const [promptResult, setPromptResult] = useState("");
  const copyButtonRef = useRef<HTMLButtonElement>();

  const getResponse = () => {
    setLoading(true);
    setPromptResult("");
    const source = new EventSource(
      `${apiURL}/chat?prompt=${encodeURIComponent(promptInput)}`
    );
    let result = "";
    source.onmessage = (event) => {
      const msg = event.data.replace(/^"(.*)"$/s, "$1"); // somehow leading whitespace was being stripped from the message returned, so they are wrapped in quotes now on the BE
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

  const inputRef = useRef<HTMLInputElement>();

  // hack to ensure input has focus since we are in a shadow dom, see inputRef on TextField below
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
          <DialogContentText>
            Enter prompt for ChatGPT (press enter to submit):
          </DialogContentText>
          <TextField
            multiline
            fullWidth
            inputRef={(el) => {
              inputRef.current = el;
            }}
            disabled={loading}
            label="Enter prompt"
            value={promptInput}
            error={error.length > 0}
            helperText={error}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                ev.preventDefault();
                if (!error) {
                  getResponse();
                }
              }
            }}
            onChange={(e) => {
              if (e.target.value.length > maxLength) {
                setError(`too long, max ${maxLength} characters`);
              } else if (error.length) {
                setError("");
              }
              setPromptInput(e.target.value);
            }}
          ></TextField>
          <Divider />
          <DialogContentText>Result:</DialogContentText>
          <DialogContentText whiteSpace="pre-wrap">
            {promptResult}
          </DialogContentText>
          <DialogActions>
            <Button
              ref={(el) => (copyButtonRef.current = el)}
              onClick={() => {
                navigator.clipboard.writeText(promptResult);
              }}
            >
              Copy to Clipboard
            </Button>
            <Button
              onClick={() => {
                setGlobalModalOpen(false);
                setModalOpen(false);
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
