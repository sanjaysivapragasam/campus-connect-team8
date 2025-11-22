// ---------------------------
// IMPORTS AND SETUP
// ---------------------------
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config(); // Load environment variables
const { sendEmail } = require("./services/emailService");

// ---------------------------
// FIREBASE INITIALIZATION
// ---------------------------
const serviceAccount = require("./config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ---------------------------
// EXPRESS SERVER SETUP
// ---------------------------
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// ---------------------------
// TEST ROUTE (optional)
// --------------------------

app.get("/", (req, res) => {
  res.json({
    message: "Team 8 - Event Feedback & Notification System",
    status: "Running",
    endpoints: [
      "POST /api/feedback/submit",
      "GET /api/feedback/event/:eventId",
      "GET /api/feedback/summary/:eventId",
      "POST /api/notifications/send",
      "GET /api/notifications/user/:userId",
    ],
  });
});

// -----------------------
// FEEDBACK ROUTES
// -------------------------

// Submit event feedback
app.post("/api/feedback/submit", async (req, res) => {
  try {
    const { eventId, userId, rating, comment } = req.body;

    if (!eventId || !userId || !rating) {
      return res
        .status(400)
        .json({ error: "Missing required fields: eventId, userId, rating" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const feedbackRef = await db.collection("feedback").add({
      eventId,
      userId,
      rating: Number(rating),
      comment: comment || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedbackId: feedbackRef.id,
    });
  } catch (error) {
    console.error("❌ Error submitting feedback:", error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// Retrieve feedback for an event
app.get("/api/feedback/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const snapshot = await db
      .collection("feedback")
      .where("eventId", "==", eventId)
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) {
      return res.json({ message: "No feedback found", feedback: [] });
    }

    const feedback = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ feedback });
  } catch (error) {
    console.error("❌ Error fetching feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

// Feedback summary (average rating)
app.get("/api/feedback/summary/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const snapshot = await db
      .collection("feedback")
      .where("eventId", "==", eventId)
      .get();

    if (snapshot.empty) {
      return res.json({
        eventId,
        totalFeedback: 0,
        averageRating: 0,
        ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    }

    let totalRating = 0;
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    snapshot.forEach((doc) => {
      const rating = doc.data().rating;
      totalRating += rating;
      ratingCounts[rating]++;
    });

    const count = snapshot.size;
    const avg = (totalRating / count).toFixed(2);

    res.json({
      eventId,
      totalFeedback: count,
      averageRating: Number(avg),
      ratings: ratingCounts,
    });
  } catch (error) {
    console.error("❌ Error summarizing feedback:", error);
    res.status(500).json({ error: "Failed to summarize feedback" });
  }
});

// ------------------------
// NOTIFICATION ROUTES
// ------------------------

// Send a notification + optional email
app.post("/api/notifications/send", async (req, res) => {
  try {
    const { userId, userEmail, type, title, message } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({
        error: "Missing required fields: userId, type, title, message",
      });
    }

    const notificationRef = await db.collection("notifications").add({
      userId,
      type,
      title,
      message,
      read: false,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Optional email
    if (userEmail) {
      await sendEmail(
        userEmail,
        `CampusConnect - ${title}`,
        `Hello!\n\n${message}\n\n— Team 8`
      );
    }

    res.status(201).json({
      success: true,
      message: "Notification stored (and emailed if address provided).",
      notificationId: notificationRef.id,
    });
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

// Get notifications for a user
app.get("/api/notifications/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db
      .collection("notifications")
      .where("userId", "==", userId)
      .orderBy("sentAt", "desc")
      .limit(50)
      .get();

    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ notifications });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// --------------
// START SERVER
// -------------
app.listen(PORT, () => {
  console.log(`Team 8 API running on http://localhost:${PORT}`);
  console.log(`Feedback endpoints ready`);
  console.log(`Notification endpoints ready`);
});
