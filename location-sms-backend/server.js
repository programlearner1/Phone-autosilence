const express = require("express");
const twilio = require("twilio");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); // Allow frontend requests

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post("/send-sms", async (req, res) => {
  const { to, message } = req.body;
  console.log("📩 Received SMS Request:", req.body); // ✅ Log incoming data

  if (!to || !message) {
    console.error("❌ Missing 'to' or 'message'", req.body);
    return res.status(400).json({ success: false, error: "Missing 'to' or 'message' field" });
  }

  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log("✅ SMS sent:", sms.sid);
    res.json({ success: true, message: "SMS sent successfully!", sid: sms.sid });
  } catch (error) {
    console.error("❌ Twilio Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
