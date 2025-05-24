import { describe, expect, it, vi } from "vitest";

vi.mock(
  "../../components/containers/SearchBookingContainer/SearchBookingContainer",
  () => ({
    default: () => <div data-testid="search-container">SearchContainer</div>,
  })
);

import { render, screen } from "@testing-library/react";
import SearchBooking from "./SearchBooking";

describe("Home Page", () => {
  it("renders the page title", () => {
    render(<SearchBooking />);
    const titles = screen.getAllByText(/^Prenotazioni$/i);
    expect(titles).toHaveLength(2);
  });

  it("renders the SearchContainer", () => {
    render(<SearchBooking />);
    expect(screen.getByTestId("search-container")).toBeInTheDocument();
  });
});
