import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBookings } from "../../../api/booking/bookingApi";
import { getCalendar } from "../../../api/calendar/calendarApi";
import { getTimetables } from "../../../api/timetable/timetableApi";
import SearchBookingContainer from "./SearchBookingContainer";

// Mock delle API
vi.mock("../../../api/timetable/timetableApi", () => ({
  getTimetables: vi.fn(),
}));

vi.mock("../../../api/calendar/calendarApi", () => ({
  getCalendar: vi.fn(),
}));

vi.mock("../../../api/booking/bookingApi", () => ({
  getBookings: vi.fn(),
}));

// Configure QueryClient for testing
const createTestQueryClient = () => new QueryClient();

function renderWithQueryClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
}

describe("SearchBookingContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock default successful responses
    vi.mocked(getCalendar).mockResolvedValue({
      today: "2024-05-24",
      tomorrow: "2024-05-25",
    });

    vi.mocked(getTimetables).mockResolvedValue({
      count: 2,
      data: [
        { id: 1, startHour: "09:00", endHour: "10:00" },
        { id: 2, startHour: "10:00", endHour: "11:00" },
      ],
    });

    vi.mocked(getBookings).mockResolvedValue({
      count: 0,
      data: [],
    });
  });

  it("renders the spinner while loading calendar data", () => {
    vi.mocked(getCalendar).mockImplementation(() => new Promise(() => {}));
    renderWithQueryClient(<SearchBookingContainer />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders welcome card when data loads successfully", async () => {
    renderWithQueryClient(<SearchBookingContainer />);

    await waitFor(() => {
      expect(
        screen.getByText("Scopri chi si allena oggi!")
      ).toBeInTheDocument();
    });
  });

  it("shows filter options when calendar loads", async () => {
    renderWithQueryClient(<SearchBookingContainer />);

    await waitFor(() => {
      expect(screen.getByText(/Filtra le prenotazioni/i));
    });
  });
});
