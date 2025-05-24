import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTimetables } from "../../../api/timetable/timetableApi";
import { getCalendar } from "../../../api/calendar/calendarApi";
import { getBookings } from "../../../api/booking/bookingApi";
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
      expect(screen.getByText("Benvenuto")).toBeInTheDocument();
      expect(
        screen.getByText(/I am\. I can\. I will\. I do\./)
      ).toBeInTheDocument();
    });
  });

  it("shows filter options when calendar loads", async () => {
    renderWithQueryClient(<SearchBookingContainer />);

    await waitFor(() => {
      expect(screen.getByText(/Filtri/i));
    });
  });
});
