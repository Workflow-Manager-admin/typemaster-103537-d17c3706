import { render, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import App from "./App";

describe("Auth tests: Login, Signup, Route Protection", () => {
  test("login with a regular user sets UI state", () => {
    const utils = render(<App />);
    fireEvent.change(utils.getByPlaceholderText(/enter your name/i), { target: { value: "Nova" } });
    fireEvent.click(utils.getByText(/login/i));
    // Should see navigation for authed user and username
    expect(utils.getByText(/leaderboard/i)).toBeInTheDocument();
    expect(utils.getByText(/profile/i)).toBeInTheDocument();
    expect(utils.getByText(/User:/)).toHaveTextContent("Nova");
  });

  test("signup flow sets UI state", () => {
    const utils = render(<App />);
    fireEvent.click(utils.getByText(/sign up/i, { selector: "button" }));
    fireEvent.change(utils.getByPlaceholderText(/choose a name/i), { target: { value: "Star" } });
    fireEvent.click(utils.getByText(/sign up/i, { selector: "button" }));
    expect(utils.getByText(/User:/)).toHaveTextContent("Star");
    expect(utils.getByText(/Typing Challenge/)).toBeInTheDocument();
  });

  test("unauthenticated users cannot access profile or admin", () => {
    const utils = render(<App />);
    // Profile
    fireEvent.click(utils.getByText(/profile/i));
    expect(utils.getByText(/login to typemaster/i)).toBeInTheDocument();
    // Admin
    fireEvent.click(utils.getByText(/admin/i));
    expect(utils.getByText(/login to typemaster/i)).toBeInTheDocument();
  });

  test("admin user has access to admin panel, normal user is blocked", () => {
    // Admin user
    const utils = render(<App />);
    fireEvent.change(utils.getByPlaceholderText(/enter your name/i), { target: { value: "admin" } });
    fireEvent.click(utils.getByText(/login/i));
    fireEvent.click(utils.getByText(/admin/i));
    expect(utils.getByText(/Admin Panel/)).toBeInTheDocument();

    // Logout, login as non-admin
    fireEvent.click(utils.getByText(/logout/i));
    fireEvent.change(utils.getByPlaceholderText(/enter your name/i), { target: { value: "notadmin" } });
    fireEvent.click(utils.getByText(/login/i));
    fireEvent.click(utils.getByText(/admin/i));
    expect(utils.getByText(/for admins only/i)).toBeInTheDocument();
  });
});
