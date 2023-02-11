import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";

export const Header = () => {
  return (
    <AppBar
      position="static"
      color="secondary"
      enableColorOnDark={true}
      sx={{ backgroundImage: "unset", boxShadow: "unset" }}
    >
      <Container>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link underline="hover" color="text.primary" href="/">
              Prompter
            </Link>
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
