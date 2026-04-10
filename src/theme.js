"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: "var(--font-montserrat)",
    logo: { fontFamily: "var(--font-dancing_script)" },
  },
  palette: {
    primary: {
      main: "#fff6e9",
      contrastText: "#6b3e2e",
    },
    reverse: {
      main: "#6b3e2e",
      contrastText: "#fff6e9",
    },
  },
});

export default theme;
