import { beforeEach, describe, expect, it, vi } from "vitest";

// Mocks generali
const logoutMock = vi.fn();

// Primo mock standard (non loading)
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isLoading: false,
    logout: logoutMock,
  }),
}));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import AppSystemAdministrator from "./AppSystemAdministrator";
import { MemoryRouter } from "react-router";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient();
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
    expect(screen.getByTestId("tab-logout")).toBeInTheDocument();
  });

  it("shows spinner when loading", async () => {
    // Reset cache per applicare il nuovo mock
    vi.resetModules();

    // Re-mock per simulare isLoading
    vi.doMock("@auth0/auth0-react", () => ({
      useAuth0: () => ({
        isLoading: true,
        logout: logoutMock,
      }),
    }));

    // Import dinamico con nuovo mock applicato
    const { default: AppSystemAdministratorLoading } = await import(
      "./AppSystemAdministrator"
    );
    renderWithQueryClient(<AppSystemAdministratorLoading />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
