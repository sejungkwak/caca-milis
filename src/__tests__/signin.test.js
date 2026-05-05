// unit tests were written with assistance from Claude Code

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import SignIn from "../app/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("axios");

describe("Sign-in page", () => {
  let mockPush;

  // set up the clean state before each test
  beforeEach(() => {
    mockPush = jest.fn();
    jest.clearAllMocks();
    const { useRouter } = require("next/navigation");
    useRouter.mockReturnValue({ push: mockPush });
  });

  // test rendering
  it("renders the sign-in form", () => {
    render(<SignIn />);

    expect(screen.getByText("Sign in to Cáca Milis")).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  // test the function handleSubmit
  it("redirects to /dashboard on successful login", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    render(<SignIn />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "user@mail.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/dashboard"));
  });
});
