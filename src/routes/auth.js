// src/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Role } = require('../models');
const validate = require('../middlewares/validate');
const { loginSchema } = require('../validators/auth');

router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email }, include: Role });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  // Build token payload
  const payload = {
    userId: user.id,
    role: (await user.getRole()).name,
    schoolId: user.schoolId
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: payload.role, schoolId: payload.schoolId } });
});

module.exports = router;
