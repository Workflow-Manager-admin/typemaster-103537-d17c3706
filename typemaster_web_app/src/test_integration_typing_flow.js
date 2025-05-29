import { render, fireEvent, act } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import App from "./App";

describe("Integration flow: Typing to Leaderboard/Profile", () => {
  test("user signups, does test, sees stats, navigates leaderboard, then profile", () => {
    // From initial, perform sign-up flow
    const utils = render(<App />);
    fireEvent.click(utils.getByText(/sign up/i, { selector: "button" }));
    fireEvent.change(utils.getByPlaceholderText(/choose a name/i), { target: { value: "Eve" } });
    fireEvent.click(utils.getByText(/sign up/i, { selector: "button" }));

    // Should arrive at TypingTest after signup
    expect(utils.getByText(/Typing Challenge/)).toBeInTheDocument();
    // Fill typing area, check stats update
    fireEvent.change(utils.getByPlaceholderText(/start typing/i), { target: { value: "integration test input text" } });
    expect(utils.getByText("WPM").nextSibling).toHaveTextContent(/\d+/);
    expect(utils.getByText("Accuracy").nextSibling).toHaveTextContent(/\d+\%/);

    // Navigate to Leaderboard
    fireEvent.click(utils.getByText(/Leaderboard/i));
    expect(utils.getByText(/Leaderboard/)).toBeInTheDocument();

    // Navigate to Profile
    fireEvent.click(utils.getByText(/Profile/i));
    expect(utils.getByText(/Profile/)).toBeInTheDocument();
    expect(utils.getByText(/avg WPM/i)).toBeInTheDocument();
    expect(utils.getByText(/avg Accuracy/i)).toBeInTheDocument();
  });
});
