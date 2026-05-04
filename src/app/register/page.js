"use client";

import { useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Link,
  MenuItem,
  Typography,
  TextField,
} from "@mui/material";

const API = "http://localhost:5001";

/**
 * Renders the sign up page at /register.
 * Handles email, password and confirm password input and form submission.
 * @returns JSX.Element
 */
export default function SignUp() {
  // store available user role options for selection
  const roles = [
    { value: "Customer", label: "Customer" },
    { value: "Admin", label: "Admin" },
  ];

  // store form data, initially an empty string
  // or "Customer" until the sign up button is clicked
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [role, setRole] = useState("Customer");

  // store custom alert messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // handle the sign up button click event
  const handleSubmit = async (event) => {
    // prevent the default browser behaviour of refreshing the page
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

    // if the password and confirm password do not match, show an error message
    if (password !== confirmPass) {
      setError("Password and confirm password do not match.");
      return;
    }

    // if password and confirm password match, register a new user
    if (password === confirmPass) {
      const res = await axios.post(
        `${API}/register`,
        { email, password, role },
        { withCredentials: true },
      );
      setSuccess(`Registered: ${res.data.message}.`);

      // clear input fields after successful registration
      setEmail("");
      setPassword("");
      setConfirmPass("");
      setRole("Customer");
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
          Sign up to Cáca Milis
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ width: "100%" }}>
              {success}
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
              setSuccess("");
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
            autoComplete=""
            color="bodyText"
            value={password}
            onChange={(event) => {
              setError("");
              setSuccess("");
              setPassword(event.target.value);
            }}
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
            value={confirmPass}
            onChange={(event) => {
              setError("");
              setSuccess("");
              setConfirmPass(event.target.value);
            }}
          />
          <TextField
            select
            margin="normal"
            required
            fullWidth
            name="role"
            label="Role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            color="bodyText"
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
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
  );
}
