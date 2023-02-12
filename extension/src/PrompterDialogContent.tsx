import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { MutableRefObject, useEffect, useState } from "react";
import { setGlobalModalOpen } from "utils";

type QueryInfo = {
  maxQueries: number;
  numQueries: number;
};

type PrompterDialogContentProps = {
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
}: PrompterDialogContentProps) => {
  const [error, setError] = useState("");
  const [queryInfo, setQueryInfo] = useState<QueryInfo>();
  const [queryInfoError, setQueryInfoError] = useState(false);
  const maxLength = 4096;

  useEffect(() => {
    if (queryToken) {
      fetch(`${appURL}/chat/info?t=${queryToken}`)
        .then((r) => r.json())
        .then((response: QueryInfo) => {
          setQueryInfo(response);
        })
        .catch(() => {
          setQueryInfoError(true);
        });
    }
  }, [queryToken]);

  if (typeof queryToken === "undefined" || typeof queryInfo === "undefined") {
    return <DialogContentText>Loading...</DialogContentText>;
  }

  if (queryToken === "") {
    return (
      <DialogContentText>
        Please <Link href={appURL}>Log in</Link> to use Prompter
      </DialogContentText>
    );
  }

  if (queryInfoError) {
    return (
      <DialogContentText>
        Could not fetch account information. Please{" "}
        <Link href={appURL}>Log in</Link> again or try again later.
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
      <Typography whiteSpace="pre-wrap">{promptResult}</Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography>
          Daily queries: {queryInfo.numQueries} / {queryInfo.maxQueries}
        </Typography>
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
      </Stack>
    </>
  );
};
