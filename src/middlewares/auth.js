// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // 1️⃣ Check for missing header
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing',
    });
  }

  // 2️⃣ Validate "Bearer <token>" format
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization format. Expected "Bearer <token>"',
    });
  }

  // 3️⃣ Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Expected payload: { userId, role, schoolId }
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload',
      });
    }

    req.user = decoded; // attach user details to request
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}

module.exports = authMiddleware;
