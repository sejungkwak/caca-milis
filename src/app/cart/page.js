"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";

/**
 * Maps over the shopping cart data and renders each item in a table with its name, price, quantity and total.
 * @returns JSX.Element
 */
export default function Dashboard() {
  // store shopping cart data, initially null until fetched
  const [cart, setCart] = useState(null);

  useEffect(() => {
    // fetch shopping cart data from the server and store it in state
    fetch("api/getCart")
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
      });
  }, []);

  // display a default message if cakes data is not ready
  if (!cart) return <p>Loading</p>;

  // calculate the total price in the cart
  const total = cart.reduce((accumulator, item) => {
    const price = parseInt(item.cake.price.slice(1));
    const quantity = parseInt(item.cake.quantity);
    const subtotal = price * quantity;
    return accumulator + subtotal;
  }, 0);

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
            Your Cart
          </Typography>
          <TableContainer sx={{ backgroundColor: theme.palette.primary.main }}>
            <Table sx={{ marginBlock: 4, minWidth: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell component="th">Cake</TableCell>
                  <TableCell component="th" align="right">
                    Price
                  </TableCell>
                  <TableCell component="th" align="right">
                    Quantity
                  </TableCell>
                  <TableCell component="th" align="right">
                    Subtotal
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((cake) => {
                  // remove the Euro sign from the price
                  const price = cake.cake.price.slice(1);

                  const subtotal =
                    parseInt(price) * parseInt(cake.cake.quantity);

                  return (
                    <TableRow key={cake.cake._id}>
                      <TableCell scope="row">{cake.cake.name}</TableCell>
                      <TableCell align="right">{cake.cake.price}</TableCell>
                      <TableCell align="right">{cake.cake.quantity}</TableCell>
                      <TableCell align="right">
                        €{subtotal.toString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell component="th" colSpan={4} align="right">
                    Total €{total}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button variant="contained">Place order</Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
