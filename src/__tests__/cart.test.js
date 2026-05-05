// unit tests were written with assistance from Claude Code

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Cart from "../app/cart/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("axios");

// fake data to test
const mockCart = [
  {
    _id: "cart1",
    username: "user1",
    cake: { _id: "cake1", name: "Cheese cake", price: "€10", quantity: 2 },
  },
  {
    _id: "cart2",
    username: "user1",
    cake: { _id: "cake2", name: "Princess cake", price: "€15", quantity: 1 },
  },
];

describe("Cart page", () => {
  let mockPush;

  // set up the clean state before each test
  beforeEach(() => {
    mockPush = jest.fn();
    jest.clearAllMocks();
    const { useRouter } = require("next/navigation");
    useRouter.mockReturnValue({ push: mockPush });
  });

  // test rendering
  it("renders cart items with name, price, quantity, subtotal, and total", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCart });
    render(<Cart />);
    expect(await screen.findByText("Cheese cake")).toBeInTheDocument();
    expect(screen.getByText("€10")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("€20")).toBeInTheDocument();

    expect(screen.getByText("Princess cake")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getAllByText("€15").length).toBeGreaterThanOrEqual(2); // price and subtotal

    expect(screen.getByText("Total €35")).toBeInTheDocument();
  });

  // test the function deleteItem
  it("removes item from cart when the delete button is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCart });
    axios.delete.mockResolvedValueOnce({});
    render(<Cart />);
    await screen.findByText("Cheese cake");

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });

    // delete the first item
    fireEvent.click(deleteButtons[0]);
    await waitFor(() =>
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/cart/cart1"),
        { withCredentials: true },
      ),
    );
  });

  // test the function handleSubmit
  it("shows order confirmation modal when the place order button is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCart });
    axios.post.mockResolvedValueOnce({});
    render(<Cart />);
    await screen.findByText("Cheese cake");

    const orderButton = screen.getByRole("button", { name: /place order/i });

    fireEvent.click(orderButton);
    expect(
      await screen.findByText("Thank you for ordering our cake!"),
    ).toBeInTheDocument();
  });
});
