import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import Login from "./Login";

const loginWithRedirectMock = vi.fn();

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    loginWithRedirect: loginWithRedirectMock,
  }),
}));

describe("Login", () => {
  it("renders all slides with correct content", () => {
    render(<Login />);

    expect(screen.getByAltText("Plank exercise")).toBeInTheDocument();
    expect(
      screen.getByText("Attività motoria preventiva e adattata")
    ).toBeInTheDocument();

    expect(screen.getByAltText("Squats exercise")).toBeInTheDocument();
    expect(screen.getByText("Ricomposizione corporea")).toBeInTheDocument();

    expect(screen.getByAltText("Bench press exercise")).toBeInTheDocument();
    expect(screen.getByText("Strength coaching")).toBeInTheDocument();
  });

  it("skips to last slide when handleSkip is called", () => {
    render(<Login />);
    const skipButton = screen.getByTestId("skip-button");
    fireEvent.click(skipButton);

    expect(screen.getByText("Strength coaching")).toBeVisible();
  });

  it("calls loginWithRedirect when login button is clicked", () => {
    render(<Login />);
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    expect(loginWithRedirectMock).toHaveBeenCalled();
  });
});
