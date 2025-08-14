import { beforeEach, describe, expect, it, vi } from "vitest";
// Primo mock standard (non loading)
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isLoading: false,
  }),
}));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import AppUsers from "./AppUsers";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Disabilita i retry per i test
        retry: false,
        // Disabilita le chiamate di rete durante i test
        enabled: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe("AppUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all navigation tabs", () => {
    renderWithQueryClient(<AppUsers />);
    expect(screen.getByTestId("tab-coaches")).toBeInTheDocument();
    expect(screen.getByTestId("tab-booking")).toBeInTheDocument();
    expect(screen.getByTestId("tab-profile")).toBeInTheDocument();
  });

  it("shows spinner when loading", async () => {
    // Reset cache per applicare il nuovo mock
    vi.resetModules();

    // Re-mock per simulare isLoading
    vi.doMock("@auth0/auth0-react", () => ({
      useAuth0: () => ({
        isLoading: true,
      }),
    }));

    // Import dinamico con nuovo mock applicato
    const { default: AppUsersLoading } = await import("./AppUsers");
    renderWithQueryClient(<AppUsersLoading />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
