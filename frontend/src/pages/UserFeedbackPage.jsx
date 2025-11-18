import React, { useMemo, useState } from "react";

const API = process.env.REACT_APP_API_URL;

export default function UserFeedbackPage() {
  const params = new URLSearchParams(window.location.search);
  const eventIdFromLink = params.get("eventId") || "event1";

  const [eventId, setEventId] = useState(eventIdFromLink);
  const [userId, setUserId] = useState("user123");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  const card = {
    border: "1px solid #dcdcdc",
    borderRadius: 10,
    padding: 24,
    marginTop: 25,
    maxWidth: 700,
    marginLeft: "auto",
    marginRight: "auto",
    background: "#ffffff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  };

  // NEW — fixed-width content area
  const formContainer = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    maxWidth: 520,
    margin: "0 auto",
  };

  const label = {
    fontWeight: 600,
    marginTop: 10,
    fontSize: "0.9rem",
  };

  const input = {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: "1rem",
    width: "100%",
  };

  const button = {
    padding: "12px 20px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    background: "#0057b7",
    color: "#fff",
    marginTop: 18,
    width: "200px",
    alignSelf: "center", // NEW — centers the button
  };

  const submitFeedback = async () => {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(`${API}/api/feedback/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, userId, rating: Number(rating), comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setMsg("✓ Thanks! Feedback submitted.");
      setComment("");
    } catch (e) {
      setMsg(`⚠ ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>Post-Event Survey</h2>
      <p style={{ textAlign: "center", marginBottom: 20 }}>
        Rate the event and share your comments.
      </p>

      <section style={card}>
        <div style={formContainer}>
          
          <div>
            <div style={label}>Event ID</div>
            <input
              style={input}
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
            />
          </div>

          <div>
            <div style={label}>User ID</div>
            <input
              style={input}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          <div>
            <div style={label}>Rating</div>

            <div style={{ display: "flex", gap: 8 }}>
              {stars.map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    background: s <= rating ? "#ffd05a" : "#f2f2f2",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {s}★
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={label}>Comment</div>
            <textarea
              style={{ ...input, height: 120 }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional comment..."
            />
          </div>

          {/* NEW — centered button */}
          <button onClick={submitFeedback} style={button} disabled={busy}>
            {busy ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </section>

      {msg && (
        <p style={{ textAlign: "center", marginTop: 20, fontWeight: 600 }}>
          {msg}
        </p>
      )}
    </div>
  );
}
