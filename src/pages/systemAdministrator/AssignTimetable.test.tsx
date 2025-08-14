import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import AssignTimetable from "./AssignTimetable";

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
