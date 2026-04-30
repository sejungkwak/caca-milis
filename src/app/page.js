"use client";

import {
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  Link,
  Typography,
  TextField,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";

/**
 * Renders the sign in page when the application is first loaded.
 * Handles email and password input and form submission.
 * @returns JSX.Element
 */
export default function SignIn() {
  // send the sign in form data to the backend API for validation against the database.
  async function runDBCallAsync(url) {
    // make a call to the backend API
    const res = await fetch(url);
    // store the response from the database
    const data = await res.json();

    // validate the form data against the database entry
    if (data.data == "valid") {
      console.log("login is valid!");
    } else {
      console.log("not valid");
    }
  }

  // handle the sign in button click event
  const handleSubmit = (event) => {
    // prevent the default browser behaviour of refreshing the page.
    event.preventDefault();

    // extract the form data from the form
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const pass = data.get("pass");

    console.log("Sent email:" + email);
    console.log("Sent pass:" + pass);

    runDBCallAsync(`api/signIn?email=${email}&pass=${pass}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        component="main"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minWidth: "100vw",
          minHeight: "100vh",
          backgroundImage: {
            xs: "url(/background_mobile.png)",
            md: "url(/background_web.png)",
          },
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "bottom center",
        }}
      >
        <Card variant="outlined" sx={{ maxWidth: 500 }}>
          <Typography component="h1" variant="h5">
            Sign in to Cáca Milis
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email address"
              name="email"
              autoComplete="email"
              autoFocus
              color="bodyText"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="pass"
              label="Password"
              type="password"
              id="pass"
              autoComplete="current-password"
              color="bodyText"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ my: 3 }}>
              Sign In
            </Button>

            <Typography
              component="p"
              variant="bodyText"
              sx={{ textAlign: "center" }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                color="inherit"
                underline="always"
                sx={{ alignSelf: "center" }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </ThemeProvider>
  );
}
