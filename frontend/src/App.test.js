import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

/**
 * Test — Navigates to the Admin Page when clicked.
 * - Ensures routing works correctly for the Admin route.
 * - Users must be able to access the Admin page reliably.
 */
test("navigates to Admin Page correctly", () => {
  render(<App />);

  const adminButton = screen.getByText(/Go to Admin Page/i);
  fireEvent.click(adminButton);

  // Admin page heading appears
  expect(screen.getByText(/Admin • Notifications/i)).toBeInTheDocument();
});

/**
 * Test — Navigates to User Feedback Page when clicked.
 * - Confirms routing for the feedback page.
 * - Checks that the second main feature is accessible.
 */
test("navigates to User Feedback Page correctly", () => {
  render(<App />);

  const feedbackButton = screen.getByText(/User Feedback Page/i);
  fireEvent.click(feedbackButton);

  // Expected content rendered from UserFeedbackPage
  expect(screen.getByText(/Submit Feedback/i)).toBeInTheDocument();
});
