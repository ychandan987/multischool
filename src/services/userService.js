// src/services/userService.js
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { sendGeneratedPasswordEmail } = require('./emailService');

function generatePassword(phone, name, date = new Date()) {
  const YYYY = date.getFullYear().toString().padStart(4,'0');
  const MM = (date.getMonth() + 1).toString().padStart(2,'0');
  const DD = date.getDate().toString().padStart(2,'0');
  return `${phone},${name},${YYYY}${MM}${DD}`;
}

async function createUser({ name, email, phone, roleId, canEditStudents = false, schoolId }) {
  const plainPassword = generatePassword(phone, name);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainPassword, salt);

  const user = await User.create({
    name, email, phone, roleId, canEditStudents, schoolId, password_hash: hash
  });

  // send email (cleartext) - in production see notes below
  await sendGeneratedPasswordEmail(email, plainPassword);

  return user;
}

module.exports = { generatePassword, createUser };
