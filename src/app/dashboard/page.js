"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import CustomerDashboard from "./customerDashboard/page";
import AdminDashboard from "./adminDashboard/page";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/**
 * Fetches the signed-in user's role from the server and renders
 * the appropriate dashboard based on the role.
 * @returns JSX.Element
 */
export default function Dashboard() {
  // Next.js router for page navigation
  const router = useRouter();

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
        // redirect to the sign in page if the user is not authenticated
        router.push("/");
      }
    };

    fetchRole();
  }, [router]);

  // display a default message until the role is fetched
  if (!role) return <p>Loading</p>;

  // render the appropriate dashboard based on the user's role
  if (role === "Admin") return <AdminDashboard />;
  return <CustomerDashboard />;
}
