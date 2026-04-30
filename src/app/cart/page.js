"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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

const API = "http://localhost:5001";

/**
 * Maps over the shopping cart data and renders each item
 * in a table with its name, price, quantity and total.
 * @returns JSX.Element
 */
export default function Dashboard() {
  const router = useRouter();

  // store shopping cart data, initially null until fetched
  const [cart, setCart] = useState(null);

  // store modal open state
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // fetch shopping cart data from the server and store it in state
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${API}/cart`, { withCredentials: true });
        setCart(res.data);
      } catch {
        // redirect to the sign in page if the user is not authenticated
        router.push("/");
      }
    };

    fetchCart();
  }, [router]);

  // display a default message if cakes data is not ready
  if (!cart) return <p>Loading</p>;

  // calculate the total price in the cart
  const total = cart.reduce((accumulator, item) => {
    const price = parseInt(item.cake.price.slice(1));
    const quantity = parseInt(item.cake.quantity);
    const subtotal = price * quantity;
    return accumulator + subtotal;
  }, 0);

  // handle the place order button click event
  async function handleSubmit() {
    // save cart items to orders collection
    await axios.post(`${API}/orders`, {}, { withCredentials: true });
    // set modal open state to true
    setOpen(true);
  }

  // handle the delete button click event
  async function deleteItem(cartId) {
    // delete a cart item by its document id
    await axios.delete(`${API}/cart/${cartId}`, { withCredentials: true });
    // update the cart state
    setCart((prev) => prev.filter((item) => item._id !== cartId));
  }

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
          {cart.length === 0 ? (
            <Typography sx={{ marginTop: 4 }}>No cakes in your cart</Typography>
          ) : (
            <>
              <TableContainer
                sx={{ backgroundColor: theme.palette.primary.main }}
              >
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
                      <TableCell component="th" />
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
                          <TableCell align="right">
                            {cake.cake.quantity}
                          </TableCell>
                          <TableCell align="right">
                            €{subtotal.toString()}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => deleteItem(cake._id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell component="th" colSpan={6} align="right">
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
                <Button variant="contained" onClick={handleSubmit}>
                  Place order
                </Button>
              </Box>
            </>
          )}
        </Box>
        <Dialog
          open={open}
          slotProps={{
            paper: { sx: { width: "50%", textAlign: "center", p: 2 } },
          }}
        >
          <DialogContent>
            <DialogContentText>
              Thank you for ordering our cake!
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={() => {
                setOpen(false);
                router.push("/dashboard");
              }}
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}
