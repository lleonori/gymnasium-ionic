import { vi } from "vitest";

// Mock useAuth0 per evitare errori di autenticazione
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isLoading: false,
    logout: vi.fn(),
  }),
}));

// describe("AppUsers", () => {
//   it("renders Home and Booking tabs", () => {
//     render(<AppUsers />);
//     expect(screen.getByText("Home")).toBeInTheDocument();
//     expect(screen.getByText("Prenotazioni")).toBeInTheDocument();
//     expect(screen.getByText("Logout")).toBeInTheDocument();
//   });
// });
