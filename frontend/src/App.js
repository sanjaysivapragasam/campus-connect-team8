import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink
} from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import UserFeedbackPage from "./pages/UserFeedbackPage";

export default function App() {
  // Main content wrapper style (centres the app visually)
  const container = {
    maxWidth: 700,
    margin: "4rem auto",
    padding: "2rem",
    textAlign: "center",
    borderRadius: 12,
    background: "#ffffff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
  };

  // Base style applied to both navigation buttons
  const baseButtonStyle = {
    display: "inline-block",
    padding: "12px 20px",
    margin: "10px",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 600,
    color: "#fff",
    transition: "0.2s" // smooth hover animations
  };

  return (
    <Router>
      {/* Full-page background wrapper */}
      <div
        style={{
          background: "#f5f6f8",
          minHeight: "100vh",
          padding: "3rem 1rem"
        }}
      >
        {/* Main card container */}
        <div style={container}>
          <h1 style={{ marginBottom: 8 }}>Campus Connect</h1>

          <p
            style={{
              marginTop: 0,
              marginBottom: 30,
              fontSize: "1.1rem",
              color: "#555"
            }}
          >
            Team 8 – Event Engagement Platform
          </p>

          {/* -------------------------
              NAVIGATION BUTTONS
              ------------------------- */}
          <div>

            {/* ADMIN PAGE BUTTON */}
            <NavLink
              to="/admin"
              // React Router provides isActive — used to highlight the active page
              style={({ isActive }) => ({
                ...baseButtonStyle,
                background: isActive ? "#0057b7" : "#6c757d"
              })}
              // Manual hover effect since using inline styles
              onMouseEnter={(e) => {
                e.target.style.background = "#0057b7";
              }}
              onMouseLeave={(e) => {
                // Only revert if user is not currently on /admin
                if (!window.location.pathname.includes("/admin")) {
                  e.target.style.background = "#6c757d";
                }
              }}
            >
              Go to Admin Page
            </NavLink>

            {/* USER FEEDBACK PAGE BUTTON */}
            <NavLink
              to="/feedback"
              style={({ isActive }) => ({
                ...baseButtonStyle,
                background: isActive ? "#0057b7" : "#6c757d"
              })}
              onMouseEnter={(e) => {
                e.target.style.background = "#0057b7";
              }}
              onMouseLeave={(e) => {
                // Only revert if user is not currently on /feedback
                if (!window.location.pathname.includes("/feedback")) {
                  e.target.style.background = "#6c757d";
                }
              }}
            >
              User Feedback Page
            </NavLink>

          </div>
        </div>

        {/* -------------------------
            ROUTE DEFINITIONS
            -------------------------
            - /admin renders the AdminPage component
            - /feedback renders the UserFeedbackPage component
          */}
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/feedback" element={<UserFeedbackPage />} />
        </Routes>
      </div>
    </Router>
  );
}
