import { describe, expect, it, vi } from "vitest";

vi.mock(
  "../../components/containers/AssignTimetableContainer/AssignTimetableContainer",
  () => ({
    default: () => (
      <div data-testid="assign-timetable-container">
        AssignTimetableContainer
      </div>
    ),
  })
);

import { render, screen } from "@testing-library/react";
import AssignTimetable from "./AssignTimetable";

describe("Home Page", () => {
  it("renders the page title", () => {
    render(<AssignTimetable />);
    const titles = screen.getAllByText(/^Assegna Orari$/i);
    expect(titles).toHaveLength(2);
  });

  it("renders the AssignTimetableContainer", () => {
    render(<AssignTimetable />);
    expect(
      screen.getByTestId("assign-timetable-container")
    ).toBeInTheDocument();
  });
});
