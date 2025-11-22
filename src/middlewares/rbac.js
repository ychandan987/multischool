// src/middlewares/rbac.js

/**
 * Require one or more roles to access a route.
 * Example: requireRoles("superadmin", "admin")
 */
function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions",
      });
    }

    return next();
  };
}

/**
 * Check if user is Super Admin
 */
function isSuperAdmin(user) {
  return user?.role === "superadmin";
}

/**
 * Check if user is Admin of the same school
 */
function isSchoolAdminOf(user, schoolId) {
  return (
    user &&
    user.role === "admin" &&
    Number(user.schoolId) === Number(schoolId)
  );
}

/**
 * Check if user belongs to same school (for teachers, staff, etc.)
 */
function isSameSchool(user, schoolId) {
  return Number(user?.schoolId) === Number(schoolId);
}

module.exports = {
  requireRoles,
  isSuperAdmin,
  isSchoolAdminOf,
  isSameSchool,
};
