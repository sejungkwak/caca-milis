"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  Grid,
  Typography,
  CardContent,
  CardMedia,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";

/**
 * Maps over the cakes data and renders each cake in a box with its image, name, price, and Add to Cart button.
 * @returns JSX.Element
 */
export default function Dashboard() {
  // store cakes data, initially null until fetched
  const [cakes, setCakes] = useState(null);

  useEffect(() => {
    // fetch cakes data from the server and store it in state
    fetch("api/getCakes")
      .then((res) => res.json())
      .then((data) => {
        setCakes(data);
      });
  }, []);

  // add a selected cake to shopping cart
  function putInCart(cakeId, cakeName, cakePrice) {
    console.log("putting in cart: " + cakeId);
    fetch(
      `api/putInCart?cakeId=${cakeId}&name=${cakeName}&price=${cakePrice}&quantity=1`,
    );
  }

  // display a default message if cakes data is not ready
  if (!cakes) return <p>Loading</p>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        component="main"
        sx={{
          minWidth: "100vw",
          minHeight: "100vh",
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Box sx={{ p: 8 }}>
          <Typography component="h1" variant="h5">
            Cakes
          </Typography>
          <Grid container spacing={3}>
            {cakes.map((cake) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cake._id}>
                <Card
                  variant="outlined"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={cake.name}
                    image={cake.image}
                  />
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography component="p" variant="bodyText">
                      {cake.name}
                    </Typography>
                    <Typography component="p" variant="bodyText">
                      {cake.price}
                    </Typography>
                  </CardContent>
                  <Button
                    variant="contained"
                    onClick={() => putInCart(cake._id, cake.name, cake.price)}
                  >
                    Add to cart
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
