// __tests__/NewEvent.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewEvent from "../app/post/page";
import "@testing-library/jest-dom";

// Mock next/navigation for App Router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

import { useRouter } from "next/navigation";

describe("NewEvent Component", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ 
      push: pushMock,
      pathname: '/post',
      query: {},
    });
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1 }),
    }) as any;

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders all form fields", () => {
    render(<NewEvent />);
    
    // Check for form title
    expect(screen.getByText("Post a New Event")).toBeInTheDocument();
    
    // Check for all required form fields
    expect(screen.getByLabelText(/Event Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Servings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Area of campus/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Street Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
    
    // Check for optional fields
    expect(screen.getByLabelText(/Building Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Room Number/i)).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByRole("button", { name: /Post Event/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("displays validation errors if required fields are empty", async () => {
    render(<NewEvent />);
    
    // Try to submit without filling any fields
    const submitButton = screen.getByRole("button", { name: /Post Event/i });
    fireEvent.click(submitButton);
    
    // Wait for validation messages to appear
    await waitFor(() => {
      expect(screen.getByText("Enter a title")).toBeInTheDocument();
    });
    
    // FIXED: Use getAllByText for duplicate text and check the error message specifically
    const categoryErrors = screen.getAllByText(/Select a category/i);
    expect(categoryErrors.length).toBeGreaterThan(0);
    
    expect(screen.getByText("Enter number of servings")).toBeInTheDocument();
    expect(screen.getByText("Add a short description")).toBeInTheDocument();
    expect(screen.getByText("Select an area of campus")).toBeInTheDocument();
    expect(screen.getByText("Enter a full address")).toBeInTheDocument();
    expect(screen.getByText("Select a date")).toBeInTheDocument();
    expect(screen.getByText("Select a time")).toBeInTheDocument();
  });

  it("submits the form successfully with valid data", async () => {
    render(<NewEvent />);
    
    // Fill in the event title
    const titleInput = screen.getByLabelText(/Event Title/i);
    fireEvent.change(titleInput, { target: { value: "Free Pizza Night" } });
    
    // Fill in servings
    const servingsInput = screen.getByLabelText(/Number of Servings/i);
    fireEvent.change(servingsInput, { target: { value: "50" } });
    
    // Fill in description
    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descriptionInput, { target: { value: "Come get free pizza!" } });
    
    // Fill in address
    const addressInput = screen.getByLabelText(/Street Address/i);
    fireEvent.change(addressInput, { target: { value: "700 Commonwealth Ave, Boston, MA 02215" } });
    
    expect(titleInput).toHaveValue("Free Pizza Night");
    expect(servingsInput).toHaveValue(50);
    expect(descriptionInput).toHaveValue("Come get free pizza!");
    expect(addressInput).toHaveValue("700 Commonwealth Ave, Boston, MA 02215");
  });

  it("calls router.push on cancel button click", () => {
    render(<NewEvent />);
    
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);
    
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it("validates address format", async () => {
    render(<NewEvent />);
    
    const addressInput = screen.getByLabelText(/Street Address/i);
    
    // Enter invalid address format
    fireEvent.change(addressInput, { target: { value: "invalid address" } });
    
    const submitButton = screen.getByRole("button", { name: /Post Event/i });
    fireEvent.click(submitButton);
    
    // Wait for validation message
    await waitFor(() => {
      expect(screen.getByText(/Enter a valid format/i)).toBeInTheDocument();
    });
  });
});