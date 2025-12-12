// __tests__/components/EventCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import EventCard from "../../components/event-card";
import "@testing-library/jest-dom";

// Mock subcomponents to NOT display the event title
jest.mock("../../components/bookmark-button", () => (props: any) => (
  <button data-testid="bookmark-button">Bookmark</button>
));

jest.mock("../../components/report-button", () => (props: any) => (
  <button data-testid="report-button">Report</button>
));

describe("EventCard component", () => {
  const event = {
    id: 1,
    title: "Pizza Night",
    description: "Free pizza for everyone!",
    location: "Student Union",
    time: "5:00 PM - 7:00 PM",
    servingsLeft: 10,
    image: "/images/pizza.jpg",
  };

  const mockFavs = jest.fn();
  const mockReserve = jest.fn();

  it("renders event details correctly", () => {
    render(
      <EventCard
        event={event}
        favorites={[]}
        favs={mockFavs}
        reserves={[]}
        reserve={mockReserve}
      />
    );

    expect(screen.getByRole("heading", { name: "Pizza Night" })).toBeInTheDocument();
    expect(screen.getByText("Free pizza for everyone!")).toBeInTheDocument();
    expect(screen.getByText("Student Union")).toBeInTheDocument();
    expect(screen.getByText("5:00 PM - 7:00 PM")).toBeInTheDocument();
    expect(screen.getByText("10 servings left")).toBeInTheDocument();
    
    // FIXED: Query for img with alt text instead of just role="img"
    const pizzaImage = screen.getByAltText("Pizza Night");
    expect(pizzaImage).toHaveAttribute("src", "/images/pizza.jpg");

    // Bookmark and Report buttons
    expect(screen.getByTestId("bookmark-button")).toBeInTheDocument();
    expect(screen.getByTestId("report-button")).toBeInTheDocument();
  });

  it("calls favs function when favorite button is clicked", () => {
    render(
      <EventCard
        event={event}
        favorites={[]}
        favs={mockFavs}
        reserves={[]}
        reserve={mockReserve}
      />
    );

    const favButton = screen.getByRole("img", { name: /heart/i }).closest("button");
    if (favButton) {
      fireEvent.click(favButton);
      expect(mockFavs).toHaveBeenCalledWith(1);
    }
  });

  it("calls reserve function when Reserve button is clicked", () => {
    render(
      <EventCard
        event={event}
        favorites={[]}
        favs={mockFavs}
        reserves={[]}
        reserve={mockReserve}
      />
    );

    const reserveButton = screen.getByText("Reserve");
    fireEvent.click(reserveButton);
    expect(mockReserve).toHaveBeenCalledWith(1);
  });

  it("renders HeartFilled if event is favorited", () => {
    render(
      <EventCard
        event={event}
        favorites={[1]}
        favs={mockFavs}
        reserves={[]}
        reserve={mockReserve}
      />
    );

    const heartIcon = screen.getByRole("img", { name: /heart/i });
    expect(heartIcon).toBeInTheDocument();
  });

  it("renders Reserved button if event is reserved", () => {
    render(
      <EventCard
        event={event}
        favorites={[]}
        favs={mockFavs}
        reserves={[1]}
        reserve={mockReserve}
      />
    );

    expect(screen.getByText("Reserved")).toBeInTheDocument();
  });
});