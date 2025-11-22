// src/routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const validate = require("../middlewares/validate");
const { loginSchema } = require("../validators/auth");

// POST /auth/login
router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Find user with role in one query
    const user = await User.findOne({
      where: { email },
      include: [{ association: "role" }],
    });

    // Generic error for security (no user leak)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 2️⃣ Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3️⃣ Prepare JWT payload
    const payload = {
      userId: user.id,
      role: user.role?.name,
      schoolId: user.schoolId,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    // 4️⃣ Remove sensitive fields before sending user object
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role?.name,
      schoolId: user.schoolId,
    };

    return res.json({
      success: true,
      token,
      user: safeUser,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

module.exports = router;
