// ProfileContainer.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProfileContainer from "./ProfileContainer";

// mock di useAuth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    user: {
      name: "Mario Rossi",
      sub: "auth0|123",
      app_metadata: {
        roles: ["admin", "user"],
      },
    },
    logout: vi.fn(),
  }),
}));

// mock di useIonRouter
const pushMock = vi.fn();
vi.mock("@ionic/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@ionic/react")>();
  return {
    ...actual,
    useIonRouter: () => ({ push: pushMock }),
  };
});

// mock deleteProfile
vi.mock("../../../api/profile/profileApi", () => ({
  deleteProfile: vi.fn(() => Promise.resolve("ok")),
}));

// mock Browser
vi.mock("@capacitor/browser", () => ({
  Browser: {
    open: vi.fn(),
  },
}));

// mock react-query useMutation
const mutateMock = vi.fn();
vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(() => ({
    mutate: mutateMock,
  })),
}));

describe("ProfileContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render user name and surname", () => {
    render(<ProfileContainer />);
    expect(screen.getByText("Mario Rossi")).toBeInTheDocument();
  });

  it("shuold show Cambia ruolo option if there are more than one roles", () => {
    render(<ProfileContainer />);
    expect(screen.getByText("Cambia ruolo")).toBeInTheDocument();
  });

  it("shuold surf to the home if click on Cambia ruolo", () => {
    render(<ProfileContainer />);
    fireEvent.click(screen.getByText("Cambia ruolo"));
    expect(pushMock).toHaveBeenCalledWith("/", "root");
  });
});
