import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import UserFeedbackPage from "./pages/UserFeedbackPage";

function App() {
  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h1>Campus Connect - Team 8</h1>
        <nav style={{ marginBottom: "2rem" }}>
          <Link to="/admin" style={{ marginRight: "1rem" }}>Admin Page</Link>
          <Link to="/feedback">User Feedback Page</Link>
        </nav>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/feedback" element={<UserFeedbackPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
