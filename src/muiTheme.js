import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif'
    },
    h2: {
      fontFamily: '"Playfair Display", serif'
    }
  },
  shape: {
    borderRadius: 2
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "var(--bg)",
          color: "var(--ink)"
        }
      }
    }
  }
});
