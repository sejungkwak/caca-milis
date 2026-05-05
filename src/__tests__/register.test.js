// unit tests were written with assistance from Claude Code

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import SignUp from "../app/register/page";

jest.mock("axios");

describe("Sign-up page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // test rendering
  it("renders the sign up form", () => {
    render(<SignUp />);

    expect(screen.getByText("Sign up to Cáca Milis")).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  // test the function handleSubmit
  it("submits with correct data when all fields are valid", async () => {
    axios.post.mockResolvedValueOnce({ data: { message: "User registered" } });
    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "user@mail.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/register"),
        expect.objectContaining({
          email: "user@mail.com",
          password: "password",
        }),
        { withCredentials: true },
      ),
    );
  });
});
