"use client";
import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    light: {
      main: "#fff6e9",
    },
    dark: {
      main: "#6b3e2e",
    },
  },
});

theme = createTheme(theme, {
  cssVariables: true,
  typography: {
    bodyText: {
      fontFamily: "var(--font-montserrat)",
      color: theme.palette.dark.main,
    },
  },
  palette: {
    primary: {
      main: theme.palette.light.main,
      contrastText: theme.palette.dark.main,
    },
    reverse: {
      main: theme.palette.dark.main,
      contrastText: theme.palette.light.main,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: "outlined" },
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "2rem",
                borderRadius: ".5rem",
                borderColor: theme.palette.dark.main,
                backgroundColor: theme.palette.light.main,
              },
            },
          ],
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: "contained" },
              style: {
                backgroundColor: theme.palette.dark.main,
                color: theme.palette.light.main,
              },
            },
          ],
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: theme.palette.dark.main,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          color: theme.palette.dark.main,
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        select: {
          color: theme.palette.dark.main,
          backgroundColor: theme.palette.light.main,
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        list: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.light.main,
          color: theme.palette.dark.main,

          "&:hover, &.Mui-selected:hover": {
            backgroundColor: theme.palette.dark.main,
            color: theme.palette.light.main,
          },

          "&.Mui-selected": {
            backgroundColor: theme.palette.light.main,
            color: theme.palette.dark.main,
          },
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          color: theme.palette.dark.main,
          fontFamily: "var(--font-montserrat)",
          variants: [
            {
              props: { variant: "h5" },
              style: {
                fontWeight: "600",
              },
            },
            {
              props: { variant: "logo" },
              style: {
                fontFamily: "var(--font-dancing_script)",
                color: theme.palette.dark.main,
              },
            },
          ],
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: theme.palette.dark.main,
          fontFamily: "var(--font-montserrat)",
          variants: [
            {
              props: { component: "th" },
              style: { fontWeight: "600" },
            },
          ],
        },
      },
    },
  },
});

export default theme;
