// unit tests were written with assistance from Claude Code

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import CustomerDashboard from "../app/dashboard/customerDashboard/page";

jest.mock("axios");

// fake data to test
const mockCakes = [
  {
    _id: "cake1",
    name: "Cheese cake",
    price: "€10",
    image: "/cake1.png",
  },
  {
    _id: "cake2",
    name: "Princess cake",
    price: "€15",
    image: "/cake2.png",
  },
  {
    _id: "cake3",
    name: "Red velvet cake",
    price: "€20",
    image: "/cake3.png",
  },
];

describe("CustomerDashboard page", () => {
  // set up the clean state before each test
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ temp: 15 }) }),
    );
  });

  // test rendering
  it("renders all cakes with image, name, price, and add to cart button", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCakes });
    render(<CustomerDashboard />);

    expect(await screen.findByText("Cheese cake")).toBeInTheDocument();
    expect(screen.getByAltText("Cheese cake")).toHaveAttribute(
      "src",
      "/cake1.png",
    );
    expect(screen.getByText("€10")).toBeInTheDocument();

    expect(screen.getByText("Princess cake")).toBeInTheDocument();
    expect(screen.getByAltText("Princess cake")).toHaveAttribute(
      "src",
      "/cake2.png",
    );
    expect(screen.getByText("€15")).toBeInTheDocument();

    expect(screen.getByText("Red velvet cake")).toBeInTheDocument();
    expect(screen.getByAltText("Red velvet cake")).toHaveAttribute(
      "src",
      "/cake3.png",
    );
    expect(screen.getByText("€20")).toBeInTheDocument();

    expect(screen.getAllByText("Add to cart").length).toBeGreaterThanOrEqual(3);
  });

  // test the function putInCart
  it("calls POST /cart with cake details when Add to cart is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCakes });
    axios.post.mockResolvedValueOnce({});
    render(<CustomerDashboard />);
    await screen.findByText("Cheese cake");

    const buttons = screen.getAllByRole("button", { name: /add to cart/i });

    // add the first item to cart
    fireEvent.click(buttons[0]);
    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/cart"),
        {
          cake: {
            _id: "cake1",
            name: "Cheese cake",
            quantity: 1,
            price: "€10",
          },
        },
        { withCredentials: true },
      ),
    );
  });
});
