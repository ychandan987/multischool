// src/routes/usersRoot.js
const express = require("express");
const router = express.Router();
const { User } = require("../models");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { updateUserSchema } = require("../validators/user");
const { isSuperAdmin, isSchoolAdminOf, isSameSchool } = require("../middlewares/rbac");

router.use(auth);

/**
 * Securely remove sensitive fields
 */
function safeUser(user) {
  const obj = user.toJSON();
  delete obj.password_hash;
  return obj;
}

/**
 * Anyone can:
 * - get their own profile
 * - school admin can manage users in their school
 * - superadmin can manage all users
 */
function canAccess(caller, target) {
  return (
    caller.userId === target.id ||
    isSuperAdmin(caller) ||
    isSchoolAdminOf(caller, target.schoolId)
  );
}

//
// GET /users/:id  — global user profile
//
router.get("/:id", async (req, res) => {
  try {
    const caller = req.user;

    const user = await User.findByPk(req.params.id, {
      include: [{ association: "role" }],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!canAccess(caller, user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return res.json({ success: true, data: safeUser(user) });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

//
// PUT /users/:id — update user
//
router.put("/:id", validate(updateUserSchema), async (req, res) => {
  try {
    const caller = req.user;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!canAccess(caller, user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    //
    // Restrictions
    //

    // Non-superadmin cannot change school
    if (!isSuperAdmin(caller)) {
      delete req.body.schoolId;
    }

    // Non-superadmin cannot change role
    if (!isSuperAdmin(caller) && req.body.roleId) {
      delete req.body.roleId;
    }

    // Non-admin cannot modify canEditStudents
    if (!isSuperAdmin(caller) && !isSchoolAdminOf(caller, user.schoolId)) {
      if ("canEditStudents" in req.body) delete req.body.canEditStudents;
    }

    await user.update(req.body);

    return res.json({ success: true, data: safeUser(user) });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ success: false, message: "Failed to update user" });
  }
});

module.exports = router;
