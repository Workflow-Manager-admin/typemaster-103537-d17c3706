import { render, fireEvent, act } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import App from "./App";

const demoUser = { name: "CompTest", tests: 7, isAdmin: false, id: "c001" };

// Helper: login to get to TypingTest
function getToTypingTest() {
  const utils = render(<App />);
  fireEvent.change(utils.getByPlaceholderText(/enter your name/i), { target: { value: demoUser.name } });
  fireEvent.click(utils.getByText(/login/i));
  return utils;
}

describe("TypingTest component", () => {
  test("renders instructions, stats, timer, and user name", () => {
    const utils = getToTypingTest();
    expect(utils.getByText(/Typing Challenge/i)).toBeInTheDocument();
    expect(utils.getByText(/quick brown fox/i)).toBeInTheDocument();
    expect(utils.getByText("WPM")).toBeInTheDocument();
    expect(utils.getByText("Accuracy")).toBeInTheDocument();
    expect(utils.getByText("Time")).toBeInTheDocument();
    expect(utils.getByText(/User:/i)).toHaveTextContent(demoUser.name);
  });

  test("allows typing, updates stats, and disables textarea when time is 0", () => {
    jest.useFakeTimers();
    const utils = getToTypingTest();
    const textarea = utils.getByPlaceholderText(/start typing/i);

    fireEvent.change(textarea, { target: { value: "hello test" } });
    expect(textarea).toHaveValue("hello test");

    // Fast forward to timer 0
    act(() => {
      jest.advanceTimersByTime(30000);
    });
    expect(textarea).toBeDisabled();
    jest.useRealTimers();
  });

  test("Restart button functions correctly", () => {
    const utils = getToTypingTest();
    const textarea = utils.getByPlaceholderText(/start typing/i);
    fireEvent.change(textarea, { target: { value: "practice makes perfect" } });
    fireEvent.click(utils.getByText(/restart/i));
    expect(textarea).toHaveValue("");
    expect(utils.getByText("Time").parentNode).toHaveTextContent("30");
  });
});
