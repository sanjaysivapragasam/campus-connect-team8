import React, { useState } from "react";

// Base API URL from environment variables
const API = process.env.REACT_APP_API_URL;

export default function AdminPage() {
  // ---------------------------------------
  // FORM STATE — used to send notifications
  // ---------------------------------------
  const [form, setForm] = useState({
    userId: "user123",
    userEmail: "sanjay.sivapragasam@torontomu.ca",
    type: "reminder",
    title: "CampusConnect Test Email",
    message: "This is a test email from Team 8.",
  });

  // UserId used for loading notifications
  const [lookupUserId, setLookupUserId] = useState("user123");

  // Notification list for the viewer section
  const [notifs, setNotifs] = useState([]);

  // UI feedback states
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // ------------------
  // Inline style blocks
  // ------------------
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

  // Fixed-width form layout wrapper
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
    width: "180px",
    alignSelf: "center",
  };

  const buttonSecondary = {
    ...button,
    background: "#6c757d",
  };

  // ---------------------------------------------------
  // SEND NOTIFICATION — POST request to backend service
  // ---------------------------------------------------
  const sendNotification = async () => {
    setBusy(true);
    setMsg("");

    try {
      const res = await fetch(`${API}/api/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setMsg(`✓ ${data.message} (id: ${data.notificationId})`);
    } catch (e) {
      setMsg(`⚠ ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  // --------------------------------------------------------
  // LOAD USER NOTIFICATIONS — GET request by userId (lookup)
  // --------------------------------------------------------
  const fetchNotifications = async () => {
    setBusy(true);
    setMsg("");

    try {
      const res = await fetch(`${API}/api/notifications/user/${lookupUserId}`);
      const data = await res.json();

      // Store loaded notifications
      setNotifs(data.notifications || []);
      setMsg(`✓ Loaded ${data.notifications?.length || 0} notifications`);
    } catch (e) {
      setMsg(`⚠ ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  // ---------------------------------------
  // COMPONENT UI — SEND + VIEW notifications
  // ---------------------------------------
  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Admin • Notifications
      </h2>

      {/* ============================
          SEND NOTIFICATION SECTION
         ============================ */}
      <section style={card}>
        <h3 style={{ marginBottom: 15 }}>Send Notification + Email</h3>

        {/* All inputs grouped in a narrow container */}
        <div style={formContainer}>
          {/* USER ID */}
          <div>
            <div style={label}>User ID</div>
            <input
              style={input}
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            />
          </div>

          {/* USER EMAIL */}
          <div>
            <div style={label}>User Email</div>
            <input
              style={input}
              value={form.userEmail}
              onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
            />
          </div>

          {/* NOTIFICATION TYPE */}
          <div>
            <div style={label}>Notification Type</div>
            <select
              style={input}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="reminder">Reminder</option>
              <option value="cancellation">Cancellation</option>
              <option value="waitlist">Waitlist</option>
              <option value="reward">Reward</option>
              <option value="broadcast">Broadcast</option>
            </select>
          </div>

          {/* TITLE */}
          <div>
            <div style={label}>Title</div>
            <input
              style={input}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* MESSAGE */}
          <div>
            <div style={label}>Message</div>
            <textarea
              style={{ ...input, height: 130 }}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button style={button} onClick={sendNotification} disabled={busy}>
            {busy ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </section>

      {/* ============================
          VIEW NOTIFICATIONS SECTION
         ============================ */}
      <section style={card}>
        <h3>View User Notifications</h3>

        {/* User ID input + fetch button */}
        <div style={{ display: "flex", gap: 8, maxWidth: 520, margin: "0 auto" }}>
          <input
            style={input}
            value={lookupUserId}
            onChange={(e) => setLookupUserId(e.target.value)}
            placeholder="User ID"
          />
          <button
            style={buttonSecondary}
            onClick={fetchNotifications}
            disabled={busy}
          >
            {busy ? "Loading..." : "Load"}
          </button>
        </div>

        {/* Notification results list */}
        <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
          {notifs.map((n) => (
            <li
              key={n.id}
              style={{
                padding: "10px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <strong>{n.type}</strong> — <em>{n.title}</em>
              <div style={{ marginTop: 4 }}>{n.message}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Status message */}
      {msg && (
        <p style={{ textAlign: "center", marginTop: 20, fontWeight: 600 }}>
          {msg}
        </p>
      )}
    </div>
  );
}
