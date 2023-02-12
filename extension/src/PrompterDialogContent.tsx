import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import React, { MutableRefObject, useState } from "react";
import { setGlobalModalOpen } from "utils";

type PrompterDialogContent = {
  inputRef: MutableRefObject<HTMLInputElement>;
  copyButtonRef: MutableRefObject<HTMLButtonElement>;
  loading: boolean;
  promptInput: string;
  setPromptInput: (v: string) => void;
  promptResult: string;
  getResponse: () => void;
  setModalOpen: (v: boolean) => void;
  queryToken?: string;
  appURL: string;
};

export const PrompterDialogContent = ({
  inputRef,
  copyButtonRef,
  loading,
  promptInput,
  setPromptInput,
  promptResult,
  getResponse,
  setModalOpen,
  queryToken,
  appURL,
}: PrompterDialogContent) => {
  const [error, setError] = useState("");
  const maxLength = 4096;

  if (typeof queryToken === "undefined") {
    return <DialogContentText>Loading...</DialogContentText>;
  }

  if (queryToken === "") {
    return (
      <DialogContentText>
        Please <Link href={appURL}>Log in</Link> to use Prompter
      </DialogContentText>
    );
  }

  return (
    <>
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
            if (!error && promptInput) {
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
    </>
  );
};
