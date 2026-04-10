"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Typography,
  TextField,
} from "@mui/material";

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

    runDBCallAsync(`api/signIn?username=${email}&pass=${pass}`);
  };

  return (
    <Container
      component="main"
      sx={{
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
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in to Cáca Milis
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="pass"
            label="Password"
            type="pass"
            id="pass"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
