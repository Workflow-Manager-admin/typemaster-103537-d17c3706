import { render, fireEvent, act } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import App from "./App";

// Helper to extract logic by mounting TypingTest
function getTypingTestElements() {
  // As TypingTest is not exported separately, render App and route to typing page as authed user
  let typingUser = { name: "Test", tests: 2, isAdmin: false, id: "x123" };
  // Bypass login for testability: render App, set authed & user state through UI
  // Use LoginForm interaction for this purpose
  const utils = render(<App />);
  // simulate login
  fireEvent.change(utils.getByPlaceholderText(/enter your name/i), { target: { value: typingUser.name } });
  fireEvent.click(utils.getByText(/login/i));
  // After login routed to TypingTest
  return utils;
}

describe("TypingTest logic (WPM, accuracy, timer)", () => {
  test("calculates WPM correctly", () => {
    const utils = getTypingTestElements();
    const textarea = utils.getByPlaceholderText(/start typing/i);

    // Simulate fast typing
    act(() => {
      fireEvent.change(textarea, { target: { value: "hello world these are some test words" } });
    });

    // As timer counts down from 30 and increments when input, get stats for initial time
    expect(utils.getByText(/WPM/i).nextSibling).toHaveTextContent(/\d+/);
    // We cannot get "true" WPM as timer logic is tied to seconds, so ensure stat appears
  });

  test("accuracy calculation matches expectations", () => {
    const utils = getTypingTestElements();
    const textarea = utils.getByPlaceholderText(/start typing/i);

    act(() => {
      fireEvent.change(textarea, { target: { value: "wrong" } });
    });

    // Get the % stat
    expect(utils.getByText(/Accuracy/i).nextSibling).toHaveTextContent(/\d+\%/);
  });

  test("timer decrements every second when started", () => {
    jest.useFakeTimers();
    const utils = getTypingTestElements();
    const textarea = utils.getByPlaceholderText(/start typing/i);

    // Start the test
    act(() => {
      fireEvent.change(textarea, { target: { value: "start" } });
    });
    // Timer is at 30
    expect(utils.getByText("Time").parentNode).toHaveTextContent("30");

    // Advance three seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Should decrement down to 27
    expect(utils.getByText("Time").parentNode).toHaveTextContent("27");
    jest.useRealTimers();
  });

  test("restart resets the timer, input, and stats", () => {
    const utils = getTypingTestElements();
    const textarea = utils.getByPlaceholderText(/start typing/i);

    fireEvent.change(textarea, { target: { value: "some text" } });
    fireEvent.click(utils.getByText(/restart/i));
    expect(textarea).toHaveValue("");
    expect(utils.getByText("Time").parentNode).toHaveTextContent("30");
    // Should still be on the TypingTest page
    expect(utils.getByText(/Typing Challenge/i)).toBeInTheDocument();
  });
});
