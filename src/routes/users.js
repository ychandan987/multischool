// src/routes/users.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const { User, Role, School } = require("../models");
const auth = require("../middlewares/auth");
const { isSuperAdmin, isSchoolAdminOf, isSameSchool } = require("../middlewares/rbac");
const validate = require("../middlewares/validate");
const { createUserSchema, updateUserSchema } = require("../validators/user");
const { createUser } = require("../services/userService");

router.use(auth);

/**
 * Allow superadmin OR admin of the same school
 */
function canManageUsers(user, schoolId) {
  return isSuperAdmin(user) || isSchoolAdminOf(user, schoolId);
}

/**
 * Remove sensitive fields from user object
 */
function safeUser(user) {
  const obj = user.toJSON();
  delete obj.password_hash;
  return obj;
}

//
// POST /schools/:schoolId/users — create user
//
router.post("/", validate(createUserSchema), async (req, res) => {
  const schoolId = Number(req.params.schoolId);
  const caller = req.user;

  if (!canManageUsers(caller, schoolId)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    const school = await School.findByPk(schoolId);
    if (!school) {
      return res.status(404).json({ success: false, message: "School not found" });
    }

    const user = await createUser({ ...req.body, schoolId });
    return res.status(201).json({ success: true, data: safeUser(user) });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ success: false, message: "Failed to create user" });
  }
});

//
// GET /schools/:schoolId/users — list users
//
router.get("/", async (req, res) => {
  const schoolId = Number(req.params.schoolId);
  const caller = req.user;

  if (!canManageUsers(caller, schoolId)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    const users = await User.findAll({
      where: { schoolId },
      include: [{ association: "role" }],
    });

    return res.json({
      success: true,
      data: users.map((u) => safeUser(u)),
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

//
// GET /schools/:schoolId/users/:id — get a user profile (optional)
//
router.get("/:id", async (req, res) => {
  const schoolId = Number(req.params.schoolId);
  const caller = req.user;
  const userId = Number(req.params.id);

  // View permissions:
  // - superadmin can view anyone
  // - admin can view users in their own school
  // - normal staff can only view users in their school (optional)
  if (!isSuperAdmin(caller) && !isSameSchool(caller, schoolId)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    const user = await User.findOne({
      where: { id: userId, schoolId },
      include: [{ association: "role" }],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, data: safeUser(user) });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

module.exports = router;
