import { render, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import App from "./App";

// Simulate admin login, go to AdminPanel route
function adminLoginAndGoToPanel() {
  const utils = render(<App />);
  fireEvent.change(utils.getByPlaceholderText(/enter your name/i), { target: { value: "admin" } });
  fireEvent.click(utils.getByText(/login/i));
  fireEvent.click(utils.getByText(/Admin/i));
  return utils;
}

describe("AdminPanel component", () => {
  test("renders admin panel, table, buttons for admin", () => {
    const utils = adminLoginAndGoToPanel();
    expect(utils.getByText(/Admin Panel/)).toBeInTheDocument();
    expect(utils.getByText(/Manage Typing Texts/)).toBeInTheDocument();
    expect(utils.getByText(/Add New Text/)).toBeInTheDocument();
    expect(utils.getAllByText(/Edit/).length).toBeGreaterThan(0);
    expect(utils.getAllByText(/Delete/).length).toBeGreaterThan(0);
  });

  test("non-admin user cannot access admin panel", () => {
    // Login as regular user (not admin)
    const utils = render(<App />);
    fireEvent.change(utils.getByPlaceholderText(/enter your name/i), { target: { value: "notadmin" } });
    fireEvent.click(utils.getByText(/login/i));
    // Navigate to admin
    fireEvent.click(utils.getByText(/Admin/i));
    expect(utils.getByText(/for admins only/)).toBeInTheDocument();
  });
});
