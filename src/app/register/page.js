"use client";
import * as React from "react";
import {
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  Grid,
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
          <Box component="form" onSubmit={() => {}} noValidate sx={{ mt: 1 }}>
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
