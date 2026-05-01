"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/**
 * Renders the navbar with links based on the signed-in user's role.
 * @returns JSX.Element
 */
export default function Navbar() {
  // Next.js router for page navigation
  const router = useRouter();

  // get the current URL pathname
  const pathname = usePathname();

  // store the user's role, initially null until fetched
  const [role, setRole] = useState(null);

  useEffect(() => {
    // fetch the signed-in user's role from the server
    const fetchRole = async () => {
      try {
        const res = await axios.get(`${API}/auth`, {
          withCredentials: true,
        });
        setRole(res.data.role);
      } catch {
        // unauthenticated user
        setRole(null);
      }
    };

    fetchRole();
  }, [pathname]);

  // handle the logout button click event
  const handleLogout = async () => {
    // clear the cookies on the server
    await axios.post(`${API}/logout`, {}, { withCredentials: true });
    setRole(null);
    router.push("/");
  };

  return (
    <AppBar position="static">
      <Toolbar
        disableGutters
        sx={{ display: "flex", justifyContent: "space-between", px: 11, pt: 2 }}
      >
        <Typography
          variant="logo"
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          Cáca Milis
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {role === "Customer" && (
            <>
              <Button color="inherit" href="/dashboard">
                Cakes
              </Button>
              <Button color="inherit" href="/cart">
                Cart
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
          {role === "Admin" && (
            <>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
