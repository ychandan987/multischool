// src/config/mailer.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

function createMailTransport() {
  const {
    NODE_ENV,
    MAIL_STUB,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  // 1️⃣ Use a stub transport for test/dev
  if (NODE_ENV === 'test' || MAIL_STUB === 'true') {
    return nodemailer.createTransport({
      streamTransport: true,     // does not send real email
      newline: 'unix',
      buffer: true,              // email as buffer (you can log or inspect)
    });
  }

  // 2️⃣ Production SMTP transport
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: SMTP_SECURE === 'true', // ensure boolean
    auth: SMTP_USER && SMTP_PASS
      ? { user: SMTP_USER, pass: SMTP_PASS }
      : undefined,                // allow no-auth SMTP servers
    tls: {
      rejectUnauthorized: false,  // avoids self-signed cert issues
    }
  });
}

const transporter = createMailTransport();

module.exports = transporter;
