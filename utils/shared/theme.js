import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: { minWidth: 0 },
      },
    },
  },
  palette: {
    mode: "light",
    white: { main: "#FFFFFF" },
    black: { main: "#000000" },
    primary: { main: "#000000" },
    secondary: { main: "#ec008c" },
    error: { main: "#df4646" },
    success: { main: "#50fb39" },
    warning: { main: "#fba239" },
  },
});

export default lightTheme;
