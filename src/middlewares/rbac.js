// src/middlewares/rbac.js

function requireRole(roleName) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== roleName) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

// check if current user is superadmin
function isSuperAdmin(user) {
  return user && user.role === 'superadmin';
}

// check if user is admin of the same school
function isSchoolAdminOf(user, schoolId) {
  return user && user.role === 'admin' && Number(user.schoolId) === Number(schoolId);
}

module.exports = { requireRole, isSuperAdmin, isSchoolAdminOf };
