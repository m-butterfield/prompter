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
      username
    }
  }
`;

const Home = () => {
  const { user, setUser } = useContext(AppContext);
  const [googleError, setGoogleError] = useState(false);
  const [credential, setCredential] = useState("");
  const [login, { error }] = useMutation<Mutation, MutationLoginArgs>(LOGIN, {
    variables: { credential: credential },
  });

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
              setCredential(resp.credential);
              login().then((response) => {
                setUser(response.data.login);
              });
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
