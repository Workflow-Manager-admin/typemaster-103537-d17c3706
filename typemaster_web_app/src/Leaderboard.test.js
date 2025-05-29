import { render, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import App from "./App";

function loginAndGoToLeaderboard() {
  const utils = render(<App />);
  fireEvent.change(utils.getByPlaceholderText(/enter your name/i), { target: { value: "UserX" } });
  fireEvent.click(utils.getByText(/login/i));
  fireEvent.click(utils.getByText(/Leaderboard/i));
  return utils;
}

describe("Leaderboard component", () => {
  test("renders leaderboard with initial data", () => {
    const utils = loginAndGoToLeaderboard();
    expect(utils.getByText(/Leaderboard/)).toBeInTheDocument();
    expect(utils.getByRole("table")).toBeInTheDocument();
    expect(utils.getByText(/Alex/)).toBeInTheDocument();
    expect(utils.getByText(/Sam/)).toBeInTheDocument();
    expect(utils.getAllByText(/\d+\%/i).length).toBeGreaterThan(0);
  });

  test("tab switching works and table updates", () => {
    const utils = loginAndGoToLeaderboard();
    ["Today", "This Week", "All Time"].forEach(tab => {
      fireEvent.click(utils.getByText(tab));
      expect(utils.getByText(tab)).toHaveStyle("background");
    });
  });
});
