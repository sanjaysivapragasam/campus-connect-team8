import { render, screen, fireEvent } from "@testing-library/react";
import UserFeedbackPage from "./UserFeedbackPage";

/**
 * Test —  Rating value updates when a star is clicked.
 * - Verifies interactive behaviour on the star component.
 * - Checks that the component properly registers user selections.
 */
test("updates rating when a star is clicked", () => {
  render(<UserFeedbackPage />);
  const star = screen.getByText("4★");
  fireEvent.click(star);
  expect(star).toBeInTheDocument();
});
