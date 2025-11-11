import React, { useMemo, useState } from "react";

const API = process.env.REACT_APP_API_URL;

export default function UserFeedbackPage() {
  // read ?eventId=... from the URL
  const params = new URLSearchParams(window.location.search);
  const eventIdFromLink = params.get("eventId") || "event1";

  const [eventId, setEventId] = useState(eventIdFromLink);
  const [userId, setUserId] = useState("user123");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const stars = useMemo(() => [1,2,3,4,5], []);

  const submitFeedback = async () => {
    setBusy(true); setMsg("");
    try {
      const res = await fetch(`${API}/api/feedback/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, userId, rating: Number(rating), comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg("✅ Thanks! Feedback submitted.");
      setComment("");
    } catch (e) {
      setMsg(`❌ ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2>Post-Event Survey</h2>
      <p>Rate the event and leave an optional comment.</p>

      <div style={{ display: "grid", gap: 8, maxWidth: 480 }}>
        <input value={eventId} onChange={e => setEventId(e.target.value)}
               placeholder="Event ID (e.g., event1)" />
        <input value={userId} onChange={e => setUserId(e.target.value)}
               placeholder="User ID (e.g., user123)" />

        <div>
          <div>Rating:</div>
          <div style={{ display: "flex", gap: 6 }}>
            {stars.map(s => (
              <button key={s}
                onClick={() => setRating(s)}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #ccc",
                  background: s <= rating ? "#ffd05a" : "#fafafa",
                  cursor: "pointer"
                }}>
                {s}★
              </button>
            ))}
          </div>
        </div>

        <textarea rows={4} value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Optional comment..." />

        <button onClick={submitFeedback} disabled={busy}>
          {busy ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
