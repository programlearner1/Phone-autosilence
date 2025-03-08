export const sendSMS = async (recipients: string[], message: string) => {
    try {
      const response = await fetch("http://localhost:5000/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipients, message }),
      });
  
      const data = await response.json();
      if (data.success) {
        console.log("📩 SMS sent successfully!");
      } else {
        console.error("❌ SMS sending failed:", data.error);
      }
    } catch (error) {
      console.error("❌ Error sending SMS:", error);
    }
  };