import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Coach from "./Coach";

// Mock delle dipendenze
vi.mock("../../components/containers/CoachContainer/CoachContainer", () => ({
  default: () => <div data-testid="coach-container">CoachContainer</div>,
}));

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

describe("Coach Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Resetta i mock prima di ogni test
  });

  it("renders the Coach page title", () => {
    renderWithQueryClient(<Coach />);
    const titles = screen.getAllByText(/^Coaches$/i);
    expect(titles).toHaveLength(2);
  });

  it("renders the CoachContainer", () => {
    renderWithQueryClient(<Coach />);
    expect(screen.getByTestId("coach-container")).toBeInTheDocument();
  });
});
