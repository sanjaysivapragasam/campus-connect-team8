import { render, screen } from "@testing-library/react";
import App from "./App";

/**
 * Test 1 — Verifies that the main page title loads correctly.
 * 
 * Purpose:
 * - Ensures the App component renders without crashing.
 * - Confirms that the "Campus Connect" title appears on the screen.
 * 
 * Why:
 * - This is the first visible element of the application.
 * - Confirms React Router and main layout load successfully.
 */
test("renders home page title", () => {
  render(<App />);
  expect(screen.getByText(/Campus Connect/i)).toBeInTheDocument();
});

/**
 * Test 2 — Confirms that the two main navigation buttons are visible.
 * 
 * Buttons tested:
 * - "Go to Admin Page"
 * - "User Feedback Page"
 * 
 * Why it matters:
 * - These buttons are the user's primary entry points.
 * - Ensures that the navigation UI renders properly at the root route "/".
 */
test("renders navigation buttons", () => {
  render(<App />);
  expect(screen.getByText(/Go to Admin Page/i)).toBeInTheDocument();
  expect(screen.getByText(/User Feedback Page/i)).toBeInTheDocument();
});

/**
 * Test 3 — Ensures that NavLink components render without any errors.
 * 
 * What it checks:
 * - The admin navigation button is present.
 * - The feedback navigation button is present.
 * 
 * Why it matters:
 * - NavLink depends on React Router.
 * - If routing breaks, these elements will fail to appear.
 * - Confirms that the routing system initializes correctly.
 */
test("navlinks render without crashing", () => {
  render(<App />);
  const adminBtn = screen.getByText(/Go to Admin Page/i);
  const feedbackBtn = screen.getByText(/User Feedback Page/i);

  expect(adminBtn).toBeInTheDocument();
  expect(feedbackBtn).toBeInTheDocument();
});
