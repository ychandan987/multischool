const transporter = require('../config/mailer');

async function sendGeneratedPasswordEmail(toEmail, clearPassword) {
  const mail = {
    from: process.env.MAIL_FROM || 'no-reply@example.com',
    to: toEmail,
    subject: 'Your account has been created',
    text: `Your account has been created. Your temporary password: ${clearPassword}\nPlease change your password after first login.`,
  };
  const info = await transporter.sendMail(mail);
  // For streamTransport it returns message content in info.message
  return info;
}

module.exports = { sendGeneratedPasswordEmail };
