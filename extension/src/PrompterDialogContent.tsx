import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { MutableRefObject, useState } from "react";
import { QueryInfo } from "types";
import { setGlobalModalOpen } from "utils";

type PrompterDialogContentProps = {
  inputRef: MutableRefObject<HTMLInputElement>;
  copyButtonRef: MutableRefObject<HTMLButtonElement>;
  loading: boolean;
  promptInput: string;
  setPromptInput: (v: string) => void;
  promptResult: string;
  getResponse: () => void;
  setModalOpen: (v: boolean) => void;
  queryToken: string;
  queryInfo?: QueryInfo;
  queryInfoError: boolean;
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
  queryInfo,
  queryInfoError,
  appURL,
}: PrompterDialogContentProps) => {
  const [error, setError] = useState("");
  const maxLength = 4096;
  const queriesMaxed =
    queryInfo && queryInfo.numQueries >= queryInfo.maxQueries;

  if (queryInfoError) {
    return (
      <DialogContentText>
        Could not fetch account information. Please{" "}
        <Link href={appURL}>Log in</Link> again or try again later.
      </DialogContentText>
    );
  }

  if (typeof queryInfo === "undefined") {
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
        disabled={loading || queriesMaxed}
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
      <Stack direction="row" justifyContent="space-between">
        <DialogContentText>
          Daily queries used: {queryInfo.numQueries} / {queryInfo.maxQueries}
        </DialogContentText>
        {queriesMaxed && (
          <DialogContentText>
            <Link href={appURL}>Upgrade account</Link> to get more queries
          </DialogContentText>
        )}
      </Stack>
      <Divider />
      <DialogContentText>Result:</DialogContentText>
      <Typography whiteSpace="pre-wrap">{promptResult}</Typography>
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
