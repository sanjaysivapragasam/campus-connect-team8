import { render, screen, fireEvent } from "@testing-library/react";
import AdminPage from "./AdminPage";

/**
 * Test 1 — Confirms the Admin page loads with the expected titles.
 *
 * Purpose:
 * - Verifies that key UI text elements appear correctly.
 * - Confirms that the page structure renders successfully.
 *
 * Value:
 * - Ensures the page is accessible and clearly identifies its purpose.
 */
test("renders Admin page title", () => {
  render(<AdminPage />);

  // More specific to avoid matching the button text
  expect(screen.getByText("Send Notification + Email")).toBeInTheDocument();
  expect(screen.getByText(/View User Notifications/i)).toBeInTheDocument();
});

/**
 * Test 2 — Ensures the User ID input field accepts text input.
 *
 * Purpose:
 * - Verifies functional input handling.
 * - Ensures the component can capture user-entered data.
 *
 * Value:
 * - Critical for validating form usability and correct input behaviour.
 */
test("allows typing into User ID field", () => {
  render(<AdminPage />);
  const input = screen.getByPlaceholderText("User ID");
  fireEvent.change(input, { target: { value: "john123" } });
  expect(input.value).toBe("john123");
});

/**
 * Test 3 — Confirms the notification type dropdown renders correctly.
 *
 * Purpose:
 * - Ensures the default option ("reminder") is shown.
 * - Confirms the dropdown element exists.
 *
 * Value:
 * - Validates UI readiness for user selection.
 */
test("renders notification type dropdown", () => {
  render(<AdminPage />);

  // FIX: The visible text is "Reminder", not "reminder"
  const select = screen.getByDisplayValue("Reminder");

  expect(select).toBeInTheDocument();
});

/**
 * Test 4 — Ensures that the dropdown value updates when changed.
 *
 * Purpose:
 * - Tests interaction with a controlled form element.
 *
 * Value:
 * - Confirms that the component correctly handles state updates.
 */
test("dropdown value changes when selected", () => {
  render(<AdminPage />);

  // FIX: Same update here
  const select = screen.getByDisplayValue("Reminder");

  fireEvent.change(select, { target: { value: "reward" } });
  expect(select.value).toBe("reward");
});

/**
 * Test 5 — Ensures that the 'Send Notification' button is visible.
 *
 * Purpose:
 * - Confirms that users have a clear action entry point.
 *
 * Value:
 * - Ensures essential UI controls render properly before event handling tests.
 */
test("Send Notification button is visible", () => {
  render(<AdminPage />);

  // FIX: Be explicit so it selects only the button
  const btn = screen.getByRole("button", { name: "Send Notification" });

  expect(btn).toBeInTheDocument();
});
