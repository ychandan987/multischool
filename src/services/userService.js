// src/services/userService.js
const bcrypt = require("bcrypt");
const { sequelize, User } = require("../models");
const { sendGeneratedPasswordEmail } = require("./emailService");
const crypto = require("crypto");

/**
 * Generate a secure random password
 */
function generateSecurePassword(length = 12) {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
}

/**
 * Your original pattern (ONLY if needed)
 */
function generateOnboardingPassword(phone, name, date = new Date()) {
  const YYYY = date.getFullYear().toString().padStart(4, "0");
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const DD = String(date.getDate()).padStart(2, "0");
  return `${phone},${name},${YYYY}${MM}${DD}`;
}

/**
 * Create user with:
 * - Transaction safety
 * - Hashed password
 * - Optional onboarding password or random password
 * - Optional email sending
 */
async function createUser({
  name,
  email,
  phone,
  roleId,
  canEditStudents = false,
  schoolId,
}) {
  const transaction = await sequelize.transaction();

  try {
    // Secure random password OR old predictable onboarding version
    const plainPassword =
      process.env.USE_SECURE_PASSWORDS === "true"
        ? generateSecurePassword(12)
        : generateOnboardingPassword(phone, name);

    const hash = await bcrypt.hash(plainPassword, 10);

    const user = await User.create(
      {
        name,
        email,
        phone,
        roleId,
        canEditStudents,
        schoolId,
        password_hash: hash,
      },
      { transaction }
    );

    // Commit user creation before trying email (safe practice)
    await transaction.commit();

    // Send email only when enabled
    if (process.env.SEND_EMAILS !== "false") {
      // Do NOT crash if email fails
      sendGeneratedPasswordEmail(email, plainPassword).catch((err) => {
        console.error("Failed to send password email:", err.message);
      });
    }

    // Return safe user (no password)
    const safeUser = user.toJSON();
    delete safeUser.password_hash;

    return safeUser;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

module.exports = {
  generateSecurePassword,
  generateOnboardingPassword,
  createUser,
};
