import { render, screen, fireEvent } from "@testing-library/react";
import AdminPage from "./AdminPage";

/**
 * Test — Dropdown value updates when changed.
 * - Tests interaction with a controlled form element.
 * - Confirms that the component correctly handles state updates.
 */
test("dropdown value changes when selected", () => {
  render(<AdminPage />);

  const select = screen.getByDisplayValue("Reminder");

  fireEvent.change(select, { target: { value: "reward" } });
  expect(select.value).toBe("reward");
});

/**
 * Test — User ID input field accepts text input.
 * - Verifies functional input handling.
 * - Confirms that the component can capture user-entered data.
 */
test("lookup User ID field accepts typing", () => {
  render(<AdminPage />);
  const input = screen.getByPlaceholderText("User ID");
  fireEvent.change(input, { target: { value: "user789" } });
  expect(input.value).toBe("user789");
});
