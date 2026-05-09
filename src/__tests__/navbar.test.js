// unit tests were written with assistance from Claude Code

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Navbar from "../app/components/navbar/navbar";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("axios");

describe("Navbar", () => {
  let mockPush;

  // set up the clean state before each test
  beforeEach(() => {
    mockPush = jest.fn();
    jest.clearAllMocks();
    const { useRouter, usePathname } = require("next/navigation");
    useRouter.mockReturnValue({ push: mockPush });
    usePathname.mockReturnValue("/");
  });

  // test rendering
  it("always renders the site title", async () => {
    axios.get.mockResolvedValueOnce({ data: { role: "Customer" } });
    render(<Navbar />);
    expect(screen.getByText("Cáca Milis")).toBeInTheDocument();
    // wait for the async role fetch to settle so setRole runs inside act
    await screen.findByRole("button", { name: /logout/i });
  });

  it("shows Cakes, Cart, and Logout buttons for Customer role", async () => {
    axios.get.mockResolvedValueOnce({ data: { role: "Customer" } });
    render(<Navbar />);
    expect(
      await screen.findByRole("button", { name: /logout/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cakes/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cart/i })).toBeInTheDocument();
  });

  it("shows only Logout button for Admin role", async () => {
    axios.get.mockResolvedValueOnce({ data: { role: "Admin" } });
    render(<Navbar />);
    expect(
      await screen.findByRole("button", { name: /logout/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /cakes/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /cart/i }),
    ).not.toBeInTheDocument();
  });

  it("shows no nav buttons for unauthenticated users", async () => {
    axios.get.mockRejectedValueOnce(new Error("Unauthorized"));
    render(<Navbar />);
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /logout/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: /cakes/i }),
      ).not.toBeInTheDocument();
    });
  });

  // test route
  it("Cakes link points to /dashboard", async () => {
    axios.get.mockResolvedValueOnce({ data: { role: "Customer" } });
    render(<Navbar />);
    await screen.findByRole("link", { name: /cakes/i });
    expect(screen.getByRole("link", { name: /cakes/i })).toHaveAttribute(
      "href",
      "/dashboard",
    );
  });

  it("Cart link points to /cart", async () => {
    axios.get.mockResolvedValueOnce({ data: { role: "Customer" } });
    render(<Navbar />);
    await screen.findByRole("link", { name: /cart/i });
    expect(screen.getByRole("link", { name: /cart/i })).toHaveAttribute(
      "href",
      "/cart",
    );
  });

  it("calls POST /logout and redirects to / on logout", async () => {
    axios.get.mockResolvedValueOnce({ data: { role: "Customer" } });
    axios.post.mockResolvedValueOnce({});
    render(<Navbar />);
    fireEvent.click(await screen.findByRole("button", { name: /logout/i }));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/logout"),
        {},
        { withCredentials: true },
      );
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
