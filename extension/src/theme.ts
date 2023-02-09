import { createTheme } from "@mui/material/styles";

export const makeTheme = (shadowRootElement: HTMLElement) => {
  return createTheme({
    palette: {
      mode: "dark",
      background: { default: "#2c2c2c" },
      primary: {
        main: "#ffffff",
      },
      secondary: {
        main: "#454545",
      },
    },
    components: {
      MuiPopover: {
        defaultProps: {
          container: shadowRootElement,
        },
      },
      MuiPopper: {
        defaultProps: {
          container: shadowRootElement,
        },
      },
      MuiModal: {
        defaultProps: {
          container: shadowRootElement,
        },
      },
    },
    zIndex: {
      modal: 999999,
    },
  });
};
