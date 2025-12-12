// __tests__/pages/Home.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../../components/home-client";
import "@testing-library/jest-dom";

// Mock next/navigation for App Router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the dynamic Map component
jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: (func: any) => {
    const Component = () => <div>Map Component</div>;
    return Component;
  },
}));

// Mock Supabase client with properly chained methods
jest.mock("../../lib/supabase/client", () => ({
  createClient: jest.fn(() => {
    return {
      auth: {
        getUser: jest.fn(() => Promise.resolve({
          data: { user: { id: 'test-user-id' } },
          error: null,
        })),
        getSession: jest.fn(() => Promise.resolve({
          data: { session: null },
          error: null,
        })),
      },
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({
                data: null,
                error: null,
              })),
            })),
            single: jest.fn(() => Promise.resolve({
              data: null,
              error: null,
            })),
          })),
          single: jest.fn(() => Promise.resolve({
            data: null,
            error: null,
          })),
        })),
        insert: jest.fn(() => Promise.resolve({
          data: null,
          error: null,
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({
              data: null,
              error: null,
            })),
          })),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({
            data: null,
            error: null,
          })),
        })),
      })),
    };
  }),
}));

import { useRouter } from "next/navigation";

describe("Home page", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      pathname: "/",
      query: {},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the home page with mock events", () => {
    render(<Home />);

    // Check that mock events are rendered
    expect(screen.getByText("Pizza Night")).toBeInTheDocument();
    expect(screen.getByText("Taco Tuesday")).toBeInTheDocument();
    expect(screen.getByText("Sushi Social")).toBeInTheDocument();
    expect(screen.getByText("Bagel Brunch")).toBeInTheDocument();
  });

  it("renders search bar and filter button", () => {
    render(<Home />);

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /filters/i })).toBeInTheDocument();
  });

  it("renders sort buttons", () => {
    render(<Home />);

    expect(screen.getByRole("button", { name: "Servings Left" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Newest" })).toBeInTheDocument();
  });

  it("filters events by search query", () => {
    render(<Home />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "pizza" } });

    expect(screen.getByText("Pizza Night")).toBeInTheDocument();
    expect(screen.queryByText("Taco Tuesday")).not.toBeInTheDocument();
  });

  it("toggles between list and map view", () => {
    render(<Home />);

    // Initially should show list view
    expect(screen.getByText("Pizza Night")).toBeInTheDocument();

    // Find and click the Map button
    const mapButton = screen.getByRole("button", { name: /map/i });
    fireEvent.click(mapButton);

    // Map view should be displayed
    expect(screen.getByText("Map Component")).toBeInTheDocument();
  });

  it("sorts events by servings left", () => {
    render(<Home />);

    const servingsButton = screen.getByRole("button", { name: "Servings Left" });
    fireEvent.click(servingsButton);

    // After sorting by servings, "Sushi Social" (12 servings) should appear first
    const eventTitles = screen.getAllByRole("heading", { level: 5 });
    expect(eventTitles[0]).toHaveTextContent("Sushi Social");
  });

  it("opens and closes the menu drawer", () => {
    render(<Home />);

    // Open drawer
    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);

    // Check drawer content
    expect(screen.getByText("My Account")).toBeInTheDocument();
    expect(screen.getByText("Bookmarks")).toBeInTheDocument();
    expect(screen.getByText("Report a Problem")).toBeInTheDocument();
  });

  it("navigates to post page when floating button is clicked", () => {
    render(<Home />);

    // Find the floating button by its icon (plus) and class
    const postButton = screen.getByRole("button", { name: /plus/i });
    fireEvent.click(postButton);

    expect(pushMock).toHaveBeenCalledWith("/post");
  });

  it("navigates to account page from drawer menu", () => {
    render(<Home />);

    // Open drawer
    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);

    // Click account menu item
    const accountButton = screen.getByText("My Account");
    fireEvent.click(accountButton);

    expect(pushMock).toHaveBeenCalledWith("/account");
  });

  it.skip("can favorite and reserve events", () => {
    render(<Home />);
    const favoriteButtons = screen.getAllByRole("button", { name: /favorite/i });
    const reserveButtons = screen.getAllByRole("button", { name: /reserve/i });

    fireEvent.click(favoriteButtons[0]);
    fireEvent.click(reserveButtons[0]);
  });
});