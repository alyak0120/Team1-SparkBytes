import { render, screen, act } from "@testing-library/react";
import EventPostSuccess from "../../components/event-post-success";
import "@testing-library/jest-dom";

// Mock next/router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock react-confetti to avoid rendering canvas
jest.mock("react-confetti", () => (props: any) => (
  <div data-testid="confetti" style={{ width: props.width, height: props.height }} />
));

describe("EventPostSuccess component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockPush.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders success message and confetti", () => {
    render(<EventPostSuccess />);
    expect(screen.getByText("🎉 Event Successfuly Posted! 🎉")).toBeInTheDocument();
    expect(screen.getByText("Redirecting you to the events page...")).toBeInTheDocument();
    expect(screen.getByTestId("confetti")).toBeInTheDocument();
  });

  it("redirects to /event after 3 seconds", () => {
    render(<EventPostSuccess />);
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockPush).toHaveBeenCalledWith("/event");
  });
});
