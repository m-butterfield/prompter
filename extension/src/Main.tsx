import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
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

  const getResponse = () => {
    setLoading(true);
    setPromptResult("");
    const source = new EventSource(`${apiURL}/chat?prompt=${promptInput}`);
    let result = "";
    source.onmessage = (event) => {
      result += event.data;
      setPromptResult(result);
    };
    source.onerror = (event) => {
      if (event.eventPhase == EventSource.CLOSED) {
        setLoading(false);
        source.close();
      } else {
        setPromptResult("Error, please try again later...");
      }
    };
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={modalOpen}
      onClose={() => {
        setGlobalModalOpen(false);
        setModalOpen(false);
      }}
      onKeyDown={(ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          getResponse();
        }
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
            autoFocus // this doesn't work for some reason...
            disabled={loading}
            label="Enter prompt"
            value={promptInput}
            error={error.length > 0}
            helperText={error}
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
          <DialogContentText>{promptResult}</DialogContentText>
          <DialogActions>
            <Button
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
