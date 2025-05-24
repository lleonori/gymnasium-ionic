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
import AppAdmin from "./AppAdmin";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("AppAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all navigation tabs", () => {
    renderWithQueryClient(<AppAdmin />);
    expect(screen.getByTestId("tab-search")).toBeInTheDocument();
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
    const { default: AppUsersLoading } = await import("./AppAdmin");
    renderWithQueryClient(<AppUsersLoading />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
