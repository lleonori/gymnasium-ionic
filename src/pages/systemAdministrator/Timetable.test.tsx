import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Timetable from "./Timetable";

// Mock delle dipendenze
vi.mock(
  "../../components/containers/TimetableContainer/TimetableContainer",
  () => ({
    default: () => (
      <div data-testid="timetable-container">TimetableContainer</div>
    ),
  })
);

// Definisci i mock globalmente
const presentMock = vi.fn();
const dismissMock = vi.fn();

// Mock di `useIonModal`
vi.mock("@ionic/react", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>; // Cast esplicito
  return {
    ...actual,
    useIonModal: () => [presentMock, dismissMock],
  };
});

// Helper per wrappare il componente con QueryClientProvider
const queryClient = new QueryClient();
function renderWithQueryClient(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("Timetable Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Resetta i mock prima di ogni test
  });

  it("renders the Timetable page title", () => {
    renderWithQueryClient(<Timetable />);
    const titles = screen.getAllByText(/^Orari$/i);
    expect(titles).toHaveLength(2);
  });

  it("renders the TimetableContainer", () => {
    renderWithQueryClient(<Timetable />);
    expect(screen.getByTestId("timetable-container")).toBeInTheDocument();
  });
});
