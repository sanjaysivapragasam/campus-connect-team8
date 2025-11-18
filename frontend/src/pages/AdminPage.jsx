import React, { useState } from "react";

const API = process.env.REACT_APP_API_URL;

export default function AdminPage() {
  const [form, setForm] = useState({
    userId: "user123",
    userEmail: "sanjay.sivapragasam@torontomu.ca",
    type: "reminder",
    title: "CampusConnect Test Email",
    message: "This is a test email from Team 8.",
  });

  const [lookupUserId, setLookupUserId] = useState("user123");
  const [notifs, setNotifs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

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

  // NEW — limit the form content width
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
    width: "100%", // stays inside formContainer
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
    alignSelf: "center", // NEW — centers button
  };

  const buttonSecondary = {
    ...button,
    background: "#6c757d",
  };

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

  const fetchNotifications = async () => {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(`${API}/api/notifications/user/${lookupUserId}`);
      const data = await res.json();
      setNotifs(data.notifications || []);
      setMsg(`✓ Loaded ${data.notifications?.length || 0} notifications`);
    } catch (e) {
      setMsg(`⚠ ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Admin • Notifications
      </h2>

      {/* Send Notification */}
      <section style={card}>
        <h3 style={{ marginBottom: 15 }}>Send Notification + Email</h3>

        {/* NEW — wrap all inputs inside a fixed-width container */}
        <div style={formContainer}>
          <div>
            <div style={label}>User ID</div>
            <input
              style={input}
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            />
          </div>

          <div>
            <div style={label}>User Email</div>
            <input
              style={input}
              value={form.userEmail}
              onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
            />
          </div>

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

          <div>
            <div style={label}>Title</div>
            <input
              style={input}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <div style={label}>Message</div>
            <textarea
              style={{ ...input, height: 130 }}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          {/* NEW — centered button */}
          <button style={button} onClick={sendNotification} disabled={busy}>
            {busy ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </section>

      {/* Notifications viewer */}
      <section style={card}>
        <h3>View User Notifications</h3>

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

      {msg && (
        <p style={{ textAlign: "center", marginTop: 20, fontWeight: 600 }}>
          {msg}
        </p>
      )}
    </div>
  );
}
