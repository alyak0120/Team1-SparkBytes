// __tests__/components/Filters.test.tsx
// __tests__/components/Filters.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Filters from "../../components/filters";

// Mock getComputedStyle for Ant Design components
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});


describe("Filters component", () => {
  const mockProps = {
    categories: ["Pizza", "Burgers"],
    categoryFilter: [],
    setCategoryFilter: jest.fn(),
    layout: "list" as const,
    sort: "time" as const,
    setSort: jest.fn(),
    sortOptions: [
      { label: "Time", value: "time" },
      { label: "Servings", value: "servings" },
    ],
    dietary: [],
    setDietary: jest.fn(),
    dietaryOptions: ["Vegetarian", "Vegan"],
    allergy: [],
    setAllergy: jest.fn(),
    allergyOptions: ["Peanuts", "Gluten"],
    location: [],
    setLocation: jest.fn(),
    locationOptions: ["North Campus", "South Campus"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Filters button", () => {
    render(<Filters {...mockProps} />);
    expect(screen.getByText(/filters/i)).toBeInTheDocument();
  });

  it("opens the drawer and shows all filter categories when Filters button is clicked", () => {
    render(<Filters {...mockProps} />);
    fireEvent.click(screen.getByText(/filters/i));
    
    expect(screen.getByText(/Category/i)).toBeInTheDocument();
    expect(screen.getByText(/Dietary Preferences/i)).toBeInTheDocument();
    expect(screen.getByText(/Allergies/i)).toBeInTheDocument();
    expect(screen.getByText(/Campus Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear all filters/i)).toBeInTheDocument();
  });

  it("calls clear functions when 'Clear all filters' is clicked", () => {
    render(<Filters {...mockProps} />);
    fireEvent.click(screen.getByText(/filters/i));
    fireEvent.click(screen.getByText(/clear all filters/i));

    expect(mockProps.setCategoryFilter).toHaveBeenCalledWith([]);
    expect(mockProps.setDietary).toHaveBeenCalledWith([]);
    expect(mockProps.setAllergy).toHaveBeenCalledWith([]);
    expect(mockProps.setLocation).toHaveBeenCalledWith([]);
  });

  it("updates category filter when a category checkbox is clicked", () => {
    render(<Filters {...mockProps} />);
    fireEvent.click(screen.getByText(/filters/i));
    
    // Expand the Category collapse panel first
    fireEvent.click(screen.getByText("Category"));
    
    const pizzaLabel = screen.getByText("Pizza");
    fireEvent.click(pizzaLabel);
    expect(mockProps.setCategoryFilter).toHaveBeenCalledWith(["Pizza"]);
  });

  it("updates dietary filter when a dietary checkbox is clicked", () => {
    render(<Filters {...mockProps} />);
    fireEvent.click(screen.getByText(/filters/i));
    
    // Expand the Dietary Preferences collapse panel first
    fireEvent.click(screen.getByText("Dietary Preferences"));
    
    const vegLabel = screen.getByText("Vegetarian");
    fireEvent.click(vegLabel);
    expect(mockProps.setDietary).toHaveBeenCalledWith(["Vegetarian"]);
  });

  it("updates allergy filter when an allergy checkbox is clicked", () => {
    render(<Filters {...mockProps} />);
    fireEvent.click(screen.getByText(/filters/i));
    
    // Expand the Allergies collapse panel first
    fireEvent.click(screen.getByText("Allergies"));
    
    const peanutLabel = screen.getByText("Peanuts");
    fireEvent.click(peanutLabel);
    expect(mockProps.setAllergy).toHaveBeenCalledWith(["Peanuts"]);
  });

  it("updates location filter when a location checkbox is clicked", () => {
    render(<Filters {...mockProps} />);
    fireEvent.click(screen.getByText(/filters/i));
    
    // Expand the Campus Location collapse panel first
    fireEvent.click(screen.getByText("Campus Location"));
    
    const northCampusLabel = screen.getByText("North Campus");
    fireEvent.click(northCampusLabel);
    expect(mockProps.setLocation).toHaveBeenCalledWith(["North Campus"]);
  });
});