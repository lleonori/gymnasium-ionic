import { vi, describe, it, expect } from "vitest";

vi.mock("../../components/containers/HomeContainer", () => ({
  default: () => <div data-testid="home-container">HomeContainer</div>,
}));

import { render, screen } from "@testing-library/react";
import Home from "./Home";

describe("Home Page", () => {
  it("renders the page title", () => {
    render(<Home />);
    const titles = screen.getAllByText(/^Home$/i);
    expect(titles).toHaveLength(2);
  });

  it("renders the HomeContainer", () => {
    render(<Home />);
    expect(screen.getByTestId("home-container")).toBeInTheDocument();
  });
});
