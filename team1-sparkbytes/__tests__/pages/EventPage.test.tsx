import { render, screen } from "@testing-library/react";
import EventPage from "../../app/event/page"; // adjust path if needed
import Home from "../../components/home-client";

jest.mock("../../components/home-client", () => jest.fn(() => <div>Home Component</div>));

describe("EventPage", () => {
  it("renders the Home component", () => {
    render(<EventPage />);
    expect(screen.getByText("Home Component")).toBeInTheDocument();
  });
});
