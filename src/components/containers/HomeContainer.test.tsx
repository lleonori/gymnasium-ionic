import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCoaches } from "../../api/coach/coachApi";
import HomeContainer from "./HomeContainer";

// Mock della funzione `getCoaches`
vi.mock("../../api/coach/coachApi", () => ({
  getCoaches: vi.fn(),
}));

// Configure QueryClient for testing
const createTestQueryClient = () => new QueryClient();

// Helper per wrappare il componente con QueryClientProvider
function renderWithQueryClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
}

describe("HomeContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Resetta i mock prima di ogni test
  });

  it("renders the spinner while loading", () => {
    // Mock di `getCoaches` per simulare il caricamento
    vi.mocked(getCoaches).mockImplementation(() => new Promise(() => {}));

    renderWithQueryClient(<HomeContainer />);

    // Verifica che lo spinner sia visibile
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
