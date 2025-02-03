const express = require("express");
const twilio = require("twilio");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); // ✅ CORS placed correctly

// ✅ Ensure environment variables are loaded
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  console.error("❌ Missing Twilio credentials. Check your .env file.");
  process.exit(1);
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post("/send-sms", async (req, res) => {
  const { to, message } = req.body;

  // ✅ Validate request data
  if (!to || !message) {
    return res.status(400).json({ success: false, error: "Missing 'to' or 'message' field" });
  }

  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log("✅ Message sent successfully:", sms.sid);
    res.json({ success: true, message: "SMS sent successfully!", sid: sms.sid });
  } catch (error) {
    console.error("❌ Twilio Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
