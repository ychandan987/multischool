// src/services/emailService.js
const transporter = require("../config/mailer");

async function sendGeneratedPasswordEmail(toEmail, clearPassword) {
  try {
    const mail = {
      from: process.env.MAIL_FROM || "No Reply <no-reply@example.com>",
      to: toEmail,
      subject: "Your account has been created",
      text: `
Your new account has been created.

Temporary password: ${clearPassword}

Please change your password after your first login.
      `.trim(),

      // Optional HTML version (much cleaner email)
      html: `
        <p>Your new account has been created.</p>
        <p><strong>Temporary password:</strong> ${clearPassword}</p>
        <p>Please change your password after your first login.</p>
      `,
    };

    const info = await transporter.sendMail(mail);

    // In dev/test (streamTransport), message is returned in info.message
    return {
      success: true,
      transport: process.env.NODE_ENV || "development",
      messageId: info.messageId || null,
      preview: info.message, // only for stub/stream transports
    };
  } catch (err) {
    console.error("Error sending password email:", err);

    return {
      success: false,
      error: err.message,
    };
  }
}

module.exports = { sendGeneratedPasswordEmail };
