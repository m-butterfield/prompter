import { gql, useMutation } from "@apollo/client";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { GoogleLogin } from "@react-oauth/google";
import { AppContext } from "app/index";
import { Mutation, MutationLoginArgs } from "graphql/types";
import React, { useContext, useState } from "react";

const LOGIN = gql`
  mutation login($credential: String!) {
    login(credential: $credential) {
      user {
        username
      }
      queryToken
    }
  }
`;

const Home = () => {
  const { user, setUser } = useContext(AppContext);
  const [googleError, setGoogleError] = useState(false);
  const [login, { error }] = useMutation<Mutation, MutationLoginArgs>(LOGIN);

  return (
    <Stack direction="column" spacing={3} alignItems="center">
      <Typography variant="h3">Welcome {user && user.username}</Typography>
      {!user && (
        <>
          <Typography>Please sign in:</Typography>
          {(googleError || error) && (
            <Alert severity="error">
              Error signing in. Please try again later.
            </Alert>
          )}
          <GoogleLogin
            onSuccess={(resp) => {
              login({ variables: { credential: resp.credential } }).then(
                (response) => {
                  setUser(response.data.login.user);
                  window.postMessage(
                    {
                      type: "prompter-query-token",
                      token: response.data.login.queryToken,
                    },
                    "*"
                  );
                }
              );
              setGoogleError(false);
            }}
            onError={() => {
              setGoogleError(true);
            }}
          />
        </>
      )}
    </Stack>
  );
};

export default Home;
