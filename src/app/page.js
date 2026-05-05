"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Link,
  Typography,
  TextField,
} from "@mui/material";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/**
 * Renders the sign in page when the application is first loaded.
 * Handles email and password input and form submission.
 * @returns JSX.Element
 */
export default function SignIn() {
  // Next.js router for page navigation
  const router = useRouter();

  // store form data, initially an empty string
  // until the sign in button is clicked
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // store custom error messages
  const [error, setError] = useState("");

  // handle the sign in button click event
  const handleSubmit = async (event) => {
    // prevent the default browser behaviour of refreshing the page.
    event.preventDefault();

    // if the email field is empty, show an error message
    if (email === "") {
      setError("Email is required.");
      return;
    }

    // if the password field is empty, show an error message
    if (password === "") {
      setError("Password is required.");
      return;
    }

    // send the sign in form data to the server for validation against the database.
    try {
      const res = await axios.post(
        `${API}/login`,
        { email, password },
        { withCredentials: true },
      );
      // redirect to the dashboard page
      router.push("/dashboard");
    } catch (error) {
      // show an auth error message for invalid credentials,
      // otherwise show a generic error message.
      if (
        error.response?.data?.message === "User not found" ||
        error.response?.data?.message === "Wrong password"
      ) {
        setError("Incorrect email or password.");
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}
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
            value={email}
            onChange={(event) => {
              setError("");
              setEmail(event.target.value);
            }}
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
            value={password}
            onChange={(event) => {
              setError("");
              setPassword(event.target.value);
            }}
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
  );
}
