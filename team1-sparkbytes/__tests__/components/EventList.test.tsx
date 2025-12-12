import { render, screen } from "@testing-library/react";
import EventList from "../../components/event-list";
import "@testing-library/jest-dom";
import EventCard from "../../components/event-card";

// Mock EventCard to avoid full rendering
// FIX: Change the backticks and add proper template literal syntax
jest.mock("../../components/event-card", () => (props: any) => (
  <div data-testid={`event-card-${props.event.id}`}>{props.event.title}</div>
));

describe("EventList component", () => {
  const events = [
    { id: 1, title: "Pizza Night" },
    { id: 2, title: "Taco Tuesday" },
  ];
  const mockFavs = jest.fn();
  const mockReserve = jest.fn();

  it("renders empty state when no events", () => {
    render(
      <EventList
        filteredEvents={[]}
        favorites={[]}
        favs={mockFavs}
        reserves={[]}
        reserve={mockReserve}
        defaults={{}}
      />
    );
    expect(screen.getByText("No events found")).toBeInTheDocument();
  });

  it("renders EventCard for each filtered event", () => {
    render(
      <EventList
        filteredEvents={events}
        favorites={[]}
        favs={mockFavs}
        reserves={[]}
        reserve={mockReserve}
        defaults={{}}
      />
    );
    expect(screen.getByTestId("event-card-1")).toHaveTextContent("Pizza Night");
    expect(screen.getByTestId("event-card-2")).toHaveTextContent("Taco Tuesday");
  });
});