"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Typography,
  CardContent,
  CardMedia,
} from "@mui/material";
import theme from "../../../theme";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/**
 * Maps over the cakes data and renders each cake in a box
 * with its image, name, price, and Add to Cart button.
 * @returns JSX.Element
 */
export default function CustomerDashboard() {
  // store cakes data, initially null until fetched
  const [cakes, setCakes] = useState(null);

  // store weather data, initially null until fetched
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchCakes = async () => {
      // fetch cakes data from the server and store it in state
      const res = await axios.get(`${API}/cakes`, { withCredentials: true });
      setCakes(res.data);
    };

    // fetch weather data from weatherapi.com and store it in state
    fetch("api/getWeather")
      .then((res) => res.json())
      .then((data) => setWeather(data));

    fetchCakes();
  }, []);

  // add a selected cake to shopping cart
  const putInCart = async (cakeId, cakeName, cakePrice) => {
    await axios.post(
      `${API}/cart`,
      {
        cake: {
          _id: cakeId,
          name: cakeName,
          quantity: 1,
          price: cakePrice,
        },
      },
      { withCredentials: true },
    );
  };

  // display a default message if weather data is not ready or is unavailable
  if (!weather) return <p>No weather data is available.</p>;

  return (
    <Container
      component="main"
      sx={{
        minWidth: "100vw",
        minHeight: "100vh",
        backgroundColor: theme.palette.primary.main,
      }}
    >
      <Box sx={{ p: 8 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Cakes
          </Typography>
          <Typography>
            Today&apos;s temperature: {JSON.stringify(weather.temp)}
          </Typography>
        </Box>
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
                <CardMedia component="img" alt={cake.name} image={cake.image} />
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
  );
}
