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
import theme from "../../theme";

/**
 * Renders the sign up page at /register.
 * Handles email, password and confirm password input and form submission.
 * @returns JSX.Element
 */
export default function SignUp() {
  // send the sign up form data to the backend API to store it in the data variable
  async function runDBCallAsync(url) {
    // make a call to the backend API
    const res = await fetch(url);
    // store the response from the database
    const data = await res.json();

    // if data is "true", the registration was successful and the user is registered
    if (data.data === "true") {
      console.log("registered.");
    } else {
      console.log("failed to register.");
    }
  }

  // handle the sign up button click event
  const handleSubmit = (event) => {
    // prevent the default browser behaviour of refreshing the page
    event.preventDefault();

    // extract the form data from the form
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const pass = data.get("pass");
    const confirmPass = data.get("confirmPass");

    console.log("Sent email:" + email);
    console.log("Sent pass:" + pass);
    console.log("Sent confirmPass:" + confirmPass);

    // call runDBCallAsync if the password field is not empty and password and confirm password match
    if (pass !== "" && pass === confirmPass) {
      runDBCallAsync(
        `api/register?username=${email}&pass=${pass}&confirmPass=${confirmPass}`,
      );
    }
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
            Sign up to Cáca Milis
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
              autoComplete=""
              color="bodyText"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPass"
              label="Confirm Password"
              type="password"
              id="confirmPass"
              autoComplete=""
              color="bodyText"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ my: 3 }}>
              Sign Up
            </Button>

            <Typography
              component="p"
              variant="bodyText"
              sx={{ textAlign: "center" }}
            >
              Already have an account?{" "}
              <Link
                href="/"
                color="inherit"
                underline="always"
                sx={{ alignSelf: "center" }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </ThemeProvider>
  );
}
