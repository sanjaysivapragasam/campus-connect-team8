require("dotenv").config();
const nodemailer = require("nodemailer");

// -----------------------------------------------------
// Create a reusable Nodemailer transporter configured
// for Gmail using credentials stored in environment vars
// -----------------------------------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS, // App password or Gmail SMTP password
  },
});

// -----------------------------------------------------
// sendEmail()
// Sends a plain-text email using the configured transporter.
// Parameters:
//   to      — recipient email address
//   subject — email subject line
//   text    — plain-text email body
// -----------------------------------------------------
async function sendEmail(to, subject, text) {
  // Compose email metadata + body
  const mailOptions = {
    from: `"Campus Connect" <${process.env.EMAIL_USER}>`, // sender shown to recipient
    to,
    subject,
    text,
  };

  try {
    // Attempt delivery through Gmail SMTP
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully:", info.response);
  } catch (error) {
    // Log any SMTP or authentication error
    console.error("❌ Error sending email:", error);
  }
}

// Export utility so it can be used in routes/controllers
module.exports = { sendEmail };
