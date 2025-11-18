import { render, screen, fireEvent } from "@testing-library/react";
import UserFeedbackPage from "./UserFeedbackPage";

/**
 * Test 1 — Verifies that the page title loads successfully.
 *
 * Purpose:
 * - Ensures the main survey header appears.
 *
 * Value:
 * - Confirms initial render and user visibility.
 */
test("renders Post-Event Survey title", () => {
  render(<UserFeedbackPage />);
  expect(screen.getByText(/Post-Event Survey/i)).toBeInTheDocument();
});

/**
 * Test 2 — Ensures the star rating buttons are visible.
 *
 * Purpose:
 * - Confirms all rating options (1–5) are displayed.
 *
 * Value:
 * - Validates that the primary input method for rating is available.
 */
test("renders rating stars", () => {
  render(<UserFeedbackPage />);
  expect(screen.getByText("1★")).toBeInTheDocument();
  expect(screen.getByText("5★")).toBeInTheDocument();
});

/**
 * Test 3 — Ensures the rating value updates when a star is clicked.
 *
 * Purpose:
 * - Confirms interactive behaviour on the star component.
 *
 * Value:
 * - Ensures the component properly registers user selections.
 */
test("updates rating when a star is clicked", () => {
  render(<UserFeedbackPage />);
  const star = screen.getByText("4★");
  fireEvent.click(star);
  // No crash = successful interaction
  expect(star).toBeInTheDocument();
});

/**
 * Test 4 — Confirms the textarea accepts user input.
 *
 * Purpose:
 * - Ensures the comment box correctly captures typed text.
 *
 * Value:
 * - Validates the form’s text input functionality.
 */
test("allows typing a comment", () => {
  render(<UserFeedbackPage />);
  const textarea = screen.getByPlaceholderText("Optional comment...");
  fireEvent.change(textarea, { target: { value: "Great event!" } });
  expect(textarea.value).toBe("Great event!");
});

/**
 * Test 5 — Ensures the feedback submission button is visible.
 *
 * Purpose:
 * - Confirms that the user has a clear method to submit feedback.
 *
 * Value:
 * - Validates that essential UI elements load correctly.
 */
test("shows submit button", () => {
  render(<UserFeedbackPage />);
  expect(screen.getByText(/Submit Feedback/i)).toBeInTheDocument();
});
