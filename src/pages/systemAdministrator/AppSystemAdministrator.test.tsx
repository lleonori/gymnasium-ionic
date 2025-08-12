import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock standard (non loading)
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isLoading: false,
  }),
}));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import AppSystemAdministrator from "./AppSystemAdministrator";
import { MemoryRouter } from "react-router";

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

describe("AppSystemAdministrator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all navigation tabs", () => {
    renderWithQueryClient(<AppSystemAdministrator />);
    expect(screen.getByTestId("tab-coaches")).toBeInTheDocument();
    expect(screen.getByTestId("tab-timetables")).toBeInTheDocument();
    expect(screen.getByTestId("tab-assign-timetables")).toBeInTheDocument();
    expect(screen.getByTestId("tab-profile")).toBeInTheDocument();
  });

  it("shows spinner when loading", async () => {
    vi.resetModules();

    // Re-mock solo con isLoading
    vi.doMock("@auth0/auth0-react", () => ({
      useAuth0: () => ({
        isLoading: true,
      }),
    }));

    const { default: AppSystemAdministratorLoading } = await import(
      "./AppSystemAdministrator"
    );
    renderWithQueryClient(<AppSystemAdministratorLoading />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
