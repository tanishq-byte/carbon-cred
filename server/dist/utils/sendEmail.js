const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "8d6ebc001@smtp-brevo.com",
    pass: "qjXBPt0h4ySDYTzC",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Send a welcome email to the user
 * @param {string[]} recipients - Array of recipient emails
 * @param {string} subject - Email subject
 * @param {string} html - HTML body content
 */
async function sendWelcomeEmail(recipients, subject, html) {
  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    throw new Error("Invalid recipient list");
  }

  const mailOptions = {
    from: "tanishqkhetwall@gmail.com",
    to: recipients.join(','),
    subject: subject || "Welcome to Our App!",
    html: html || "<h1>Welcome!</h1><p>Thanks for joining us!</p>",
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to: ${recipients.join(', ')}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

module.exports = { sendWelcomeEmail };
