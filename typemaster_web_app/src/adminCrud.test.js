import { render, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import App from "./App";

function getAdminUtils() {
  const utils = render(<App />);
  fireEvent.change(utils.getByPlaceholderText(/enter your name/i), { target: { value: "admin" } });
  fireEvent.click(utils.getByText(/login/i));
  fireEvent.click(utils.getByText(/admin/i));
  return utils;
}

describe("AdminPanel CRUD/UI access control", () => {
  test("admin can see and click Edit, Delete, Add New Text", () => {
    const utils = getAdminUtils();
    expect(utils.getAllByText(/Edit/).length).toBeGreaterThan(0);
    expect(utils.getAllByText(/Delete/).length).toBeGreaterThan(0);
    const addBtn = utils.getByText(/Add New Text/i);
    expect(addBtn).toBeInTheDocument();
    fireEvent.click(addBtn); // just ensure it is clickable
  });

  test("attempted CRUD by non-admin is not possible; admin area is restricted", () => {
    const utils = render(<App />);
    fireEvent.change(utils.getByPlaceholderText(/enter your name/i), { target: { value: "someuser" } });
    fireEvent.click(utils.getByText(/login/i));
    fireEvent.click(utils.getByText(/admin/i));
    expect(utils.getByText(/for admins only/i)).toBeInTheDocument();
  });

  test("Edit/Delete buttons simulate click events for coverage", () => {
    const utils = getAdminUtils();
    utils.getAllByText(/Edit/)[0] && fireEvent.click(utils.getAllByText(/Edit/)[0]);
    utils.getAllByText(/Delete/)[0] && fireEvent.click(utils.getAllByText(/Delete/)[0]);
    expect(utils.getByText(/Admin Panel/)).toBeInTheDocument();
  });
});
