import { render, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import App from "./App";

function loginAndGoToProfile() {
  const utils = render(<App />);
  fireEvent.change(utils.getByPlaceholderText(/enter your name/i), { target: { value: "Riley" } });
  fireEvent.click(utils.getByText(/login/i));
  fireEvent.click(utils.getByText(/Profile/i));
  return utils;
}

describe("Profile component", () => {
  test("renders profile, stats, test history, and delete button", () => {
    const utils = loginAndGoToProfile();
    expect(utils.getByText(/Profile/)).toBeInTheDocument();
    expect(utils.getByText(/avg WPM/i)).toBeInTheDocument();
    expect(utils.getByText(/avg Accuracy/i)).toBeInTheDocument();
    expect(utils.getByText(/Delete History/i)).toBeInTheDocument();
  });

  test("delete history button triggers alert", () => {
    const utils = loginAndGoToProfile();
    window.alert = jest.fn();
    fireEvent.click(utils.getByText(/Delete History/i));
    expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/deleted/i));
  });
});
