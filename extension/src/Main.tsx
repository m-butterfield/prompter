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
};

export const Main = ({ apiURL }: MainProps) => {
  const [modalOpen, setModalOpen] = useState(true);
  const [promptInput, setPromptInput] = useState("");
  const [error, setError] = useState("");
  const maxLength = 4096;
  const [loading, setLoading] = useState(false);
  const [promptResult, setPromptResult] = useState("");

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
            disabled={loading}
            label="Enter prompt"
            value={promptInput}
            error={error.length > 0}
            helperText={error}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                ev.preventDefault();
                setLoading(true);
                fetch(`${apiURL}/graphql`, {
                  method: "POST",
                  headers: new Headers({ "Content-Type": "application/json" }),
                  body: JSON.stringify({
                    operationName: "tryChat",
                    variables: { prompt: promptInput },
                    query:
                      "query tryChat($prompt: String!) {\n  chat(prompt: $prompt)\n}\n",
                  }),
                })
                  .then((resp) => resp.json())
                  .then((resp) => {
                    setPromptResult(resp.data.chat);
                    setLoading(false);
                  })
                  .catch(() => {
                    setPromptResult(
                      "Error fetching result... please try again later."
                    );
                    setLoading(false);
                  });
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
              Cancel
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
