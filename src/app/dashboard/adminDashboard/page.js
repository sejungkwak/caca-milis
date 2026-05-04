"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Box,
  Container,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import theme from "../../../theme";

const API = "http://localhost:5001";

/**
 * Admin dashboard page.
 * Maps over all orders and renders each order's items
 * in a table with its name, price, quantity and subtotal.
 * @returns JSX.Element
 */
export default function AdminDashboard() {
  const router = useRouter();

  // store order data, initially null until fetched
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    // fetch all orders from the server and store it in state
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/orders`, { withCredentials: true });
        setOrders(res.data);
      } catch {
        // redirect to the sign in page if the user is not authenticated
        router.push("/");
      }
    };

    fetchOrders();
  }, [router]);

  // display a default message until orders are fetched
  if (!orders) return <p>Loading</p>;

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
        <Typography component="h1" variant="h5">
          Orders
        </Typography>
        {orders.length === 0 ? (
          <Typography sx={{ marginTop: 4 }}>
            No cakes have been ordered yet
          </Typography>
        ) : (
          orders.map((order) => {
            // calculate the total price for this order
            const orderTotal = order.items.reduce((accumulator, item) => {
              const price = parseInt(item.price.slice(1));
              const quantity = item.quantity;
              const subtotal = price * quantity;
              return accumulator + subtotal;
            }, 0);

            return (
              <Box key={order._id} sx={{ mt: 4 }}>
                <Typography variant="subtitle1">
                  Order placed: {new Date(order.createdAt).toLocaleString()}
                </Typography>
                <TableContainer
                  sx={{ backgroundColor: theme.palette.primary.main }}
                >
                  <Table sx={{ minWidth: "100%" }}>
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
                      {order.items.map((item) => {
                        // remove the Euro sign from the price
                        const price = item.price.slice(1);
                        const subtotal = parseInt(price) * item.quantity;

                        return (
                          <TableRow key={item._id}>
                            <TableCell scope="row">{item.name}</TableCell>
                            <TableCell align="right">{item.price}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">
                              €{subtotal.toString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell component="th" colSpan={4} align="right">
                          Order Total €{orderTotal}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Divider sx={{ mt: 2 }} />
              </Box>
            );
          })
        )}
      </Box>
    </Container>
  );
}
