// unit tests were written with assistance from Claude Code

import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Dashboard from "../app/dashboard/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("axios");

// Prevent actual child dashboards from making their own API calls
jest.mock(
  "../app/dashboard/customerDashboard/page",
  () =>
    function MockCustomerDashboard() {
      return <div>Customer Dashboard</div>;
    },
);

jest.mock(
  "../app/dashboard/adminDashboard/page",
  () =>
    function MockAdminDashboard() {
      return <div>Admin Dashboard</div>;
    },
);

describe("Dashboard router", () => {
  let mockPush;

  // set up the clean state before each test
  beforeEach(() => {
    mockPush = jest.fn();
    jest.clearAllMocks();
    const { useRouter } = require("next/navigation");
    useRouter.mockReturnValue({ push: mockPush });
  });

  // test role-based page rendering
  it("shows loading state while role is being fetched", () => {
    axios.get.mockReturnValueOnce(new Promise(() => {}));
    render(<Dashboard />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("renders AdminDashboard for Admin role", async () => {
    axios.get.mockResolvedValueOnce({ data: { role: "Admin" } });
    render(<Dashboard />);
    expect(await screen.findByText("Admin Dashboard")).toBeInTheDocument();
  });

  it("renders CustomerDashboard for Customer role", async () => {
    axios.get.mockResolvedValueOnce({ data: { role: "Customer" } });
    render(<Dashboard />);
    expect(await screen.findByText("Customer Dashboard")).toBeInTheDocument();
  });

  it("redirects to sign in if not authenticated", async () => {
    axios.get.mockRejectedValueOnce(new Error("Unauthorized"));
    render(<Dashboard />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
  });
});
