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

  const sendNotification = async () => {
    setBusy(true); setMsg("");
    try {
      const res = await fetch(`${API}/api/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg(`✅ ${data.message} (id: ${data.notificationId})`);
    } catch (e) {
      setMsg(`❌ ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  const fetchNotifications = async () => {
    setBusy(true); setMsg("");
    try {
      const res = await fetch(`${API}/api/notifications/user/${lookupUserId}`);
      const data = await res.json();
      setNotifs(data.notifications || []);
      setMsg(`✅ Loaded ${data.notifications?.length || 0} notifications`);
    } catch (e) {
      setMsg(`❌ ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2>Admin • Notifications</h2>

      <section style={{ border: "1px solid #ddd", padding: 12, marginTop: 12 }}>
        <h3>Send Notification + Email</h3>
        <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
          <input placeholder="User ID" value={form.userId}
                 onChange={e => setForm({ ...form, userId: e.target.value })}/>
          <input placeholder="User Email (optional)" value={form.userEmail}
                 onChange={e => setForm({ ...form, userEmail: e.target.value })}/>
          <select value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="reminder">reminder</option>
            <option value="cancellation">cancellation</option>
            <option value="waitlist">waitlist</option>
            <option value="reward">reward</option>
            <option value="broadcast">broadcast</option>
          </select>
          <input placeholder="Title" value={form.title}
                 onChange={e => setForm({ ...form, title: e.target.value })}/>
          <textarea placeholder="Message" rows={4} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}/>
          <button onClick={sendNotification} disabled={busy}>
            {busy ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </section>

      <section style={{ border: "1px solid #ddd", padding: 12, marginTop: 12 }}>
        <h3>View User Notifications</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={lookupUserId}
                 onChange={e => setLookupUserId(e.target.value)}
                 placeholder="User ID (e.g., user123)" />
          <button onClick={fetchNotifications} disabled={busy}>
            {busy ? "Loading..." : "Load"}
          </button>
        </div>
        <ul>
          {notifs.map(n => (
            <li key={n.id} style={{ borderBottom: "1px solid #eee", padding: 6 }}>
              <strong>{n.type}</strong> — <em>{n.title}</em>
              <div>{n.message}</div>
            </li>
          ))}
        </ul>
      </section>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
