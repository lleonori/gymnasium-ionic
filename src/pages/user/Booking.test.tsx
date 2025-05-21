import { vi, describe, it, expect } from "vitest";

vi.mock(
  "../../components/containers/BookingContainer/BookingContainer",
  () => ({
    default: () => <div data-testid="booking-container">BookingContainer</div>,
  })
);

import { render, screen } from "@testing-library/react";
import Booking from "./Booking";

describe("Booking Page", () => {
  it("renders the page title", () => {
    render(<Booking />);
    const titles = screen.getAllByText(/Prenotazioni/i);
    expect(titles).toHaveLength(2);
  });

  it("renders the BookingContainer", () => {
    render(<Booking />);
    expect(screen.getByTestId("booking-container")).toBeInTheDocument();
  });
});
