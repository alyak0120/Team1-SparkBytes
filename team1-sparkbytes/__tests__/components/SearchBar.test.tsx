import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../../components/search-bar"; // adjust path if needed

describe("SearchBar component", () => {
  const setLayoutMock = jest.fn();
  const setSearchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders List and Map buttons", () => {
    render(
      <SearchBar
        layout="list"
        setLayout={setLayoutMock}
        search=""
        setSearch={setSearchMock}
      />
    );

    expect(screen.getByRole("button", { name: /list/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /map/i })).toBeInTheDocument();
  });

  it("calls setLayout when List or Map buttons clicked", () => {
    render(
      <SearchBar
        layout="list"
        setLayout={setLayoutMock}
        search=""
        setSearch={setSearchMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /map/i }));
    expect(setLayoutMock).toHaveBeenCalledWith("map");

    fireEvent.click(screen.getByRole("button", { name: /list/i }));
    expect(setLayoutMock).toHaveBeenCalledWith("list");
  });

  it("renders search input and calls setSearch on change", () => {
    render(
      <SearchBar
        layout="list"
        setLayout={setLayoutMock}
        search=""
        setSearch={setSearchMock}
      />
    );

    const input = screen.getByPlaceholderText(/search events/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Pizza" } });
    expect(setSearchMock).toHaveBeenCalledWith("Pizza");
  });
});
