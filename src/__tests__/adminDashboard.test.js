// unit tests were written with assistance from Claude Code

import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import AdminDashboard from "../app/dashboard/adminDashboard/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("axios");

// fake data to test
const mockOrders = [
  {
    _id: "order1",
    userId: "user1",
    createdAt: "2026-05-05T10:00:00.000Z",
    items: [
      { _id: "item1", name: "Cheese cake", price: "€10", quantity: 4 },
      { _id: "item2", name: "Red velvet cake", price: "€20", quantity: 1 },
    ],
  },
  {
    _id: "order2",
    userId: "user2",
    createdAt: "2026-05-05T12:00:00.000Z",
    items: [{ _id: "item3", name: "Princess cake", price: "€15", quantity: 2 }],
  },
];

describe("AdminDashboard page", () => {
  let mockPush;

  // set up the clean state before each test
  beforeEach(() => {
    mockPush = jest.fn();
    jest.clearAllMocks();
    const { useRouter } = require("next/navigation");
    useRouter.mockReturnValue({ push: mockPush });
  });

  // test rendering
  it("renders grand total for all orders", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });
    render(<AdminDashboard />);
    await screen.findByText("Cheese cake");

    expect(screen.getByText("Grand Total: €90")).toBeInTheDocument();
  });

  it("renders order items with name, price, quantity, subtotal, and total", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });
    render(<AdminDashboard />);

    expect(await screen.findByText("Cheese cake")).toBeInTheDocument();
    expect(screen.getByText("€10")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("€40")).toBeInTheDocument();

    expect(screen.getByText("Red velvet cake")).toBeInTheDocument();
    // price and subtotal for Red velvet cake
    expect(screen.getAllByText("€20").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("1")).toBeInTheDocument();

    // total for order1
    expect(screen.getByText("Total €60")).toBeInTheDocument();

    expect(screen.getByText("Princess cake")).toBeInTheDocument();
    expect(screen.getByText("€15")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("€30")).toBeInTheDocument();

    // total for order2
    expect(screen.getByText("Total €30")).toBeInTheDocument();
  });
});
