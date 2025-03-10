const express = require("express");
const cors = require("cors");
const admin = require('firebase-admin');
require("dotenv").config();

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Route to send notification
app.post("/send-notification", async (req, res) => {
  const { token, message, title } = req.body;
  
  if (!token || !message) {
    return res.status(400).json({ 
      success: false, 
      error: "Missing required fields (token or message)" 
    });
  }

  try {
    const messagePayload = {
      notification: {
        title: title || "Location Alert",
        body: message
      },
      token: token
    };

    const response = await admin.messaging().send(messagePayload);
    console.log("✅ Notification sent successfully:", response);
    res.json({ success: true, message: "Notification sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
