const express = require("express");
const admin = require("./firebaseAdmin"); // Import Firebase Admin SDK

const app = express();
app.use(express.json());

app.post("/send-notification", async (req, res) => {
  const { token, title, body } = req.body; // Get token, title, body from frontend

  if (!token || !title || !body) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  const message = {
    notification: { title, body },
    token: token, // User's FCM Token
  };

  try {
    await admin.messaging().send(message);
    console.log("✅ Notification sent successfully!");
    res.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
