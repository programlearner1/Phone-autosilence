const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); // Allow frontend requests

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// ✅ Route to send Telegram message
app.post("/send-telegram", async (req, res) => {
  const { message } = req.body;
  console.log("📩 Incoming Telegram Request:", req.body);

  if (!message) {
    console.error("❌ Missing 'message' field");
    return res.status(400).json({ success: false, error: "Missing 'message'" });
  }

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }
    );

    console.log("✅ Telegram Message Sent:", response.data);
    res.json({ success: true, message: "Message sent to Telegram!" });
  } catch (error) {
    console.error("❌ Telegram API Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
