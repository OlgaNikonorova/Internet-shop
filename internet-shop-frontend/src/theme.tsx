import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
      light: "#333333",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6d6d6d",
      light: "#9e9e9e",
      dark: "#454545",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#000000",
      secondary: "#6d6d6d",
    },
  },
  typography: {
    fontFamily: ['"Cormorant Garamond"', "serif"].join(","),
  },
  components: {
    MuiTypography: {
      defaultProps: {
        fontFamily: "inherit",
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {},
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 20,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: 24,
        },
      },
    },
  },
});

export default theme;
