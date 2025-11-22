// src/routes/usersRoot.js
const express = require('express');
const router = express.Router();
const { User, Role } = require('../models');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { updateUserSchema } = require('../validators/user');
const { isSuperAdmin, isSchoolAdminOf } = require('../middlewares/rbac');

router.use(auth);

// get user (self allowed, admins allowed for users in their school, superadmin allowed)
router.get('/:id', async (req, res) => {
  const caller = req.user;
  const target = await User.findByPk(req.params.id);
  if (!target) return res.status(404).json({ message: 'User not found' });

  if (caller.userId === target.id || isSuperAdmin(caller) || isSchoolAdminOf(caller, target.schoolId)) {
    const json = target.toJSON();
    delete json.password_hash;
    res.json(json);
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

// update user
router.put('/:id', validate(updateUserSchema), async (req, res) => {
  const caller = req.user;
  const target = await User.findByPk(req.params.id);
  if (!target) return res.status(404).json({ message: 'User not found' });

  // only self, school admin (for same school), superadmin
  if (!(caller.userId === target.id || isSuperAdmin(caller) || isSchoolAdminOf(caller, target.schoolId))) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // cannot change schoolId by non-superadmin
  if (req.body.schoolId && !isSuperAdmin(caller)) {
    delete req.body.schoolId;
  }

  await target.update(req.body);
  const json = target.toJSON();
  delete json.password_hash;
  res.json(json);
});

module.exports = router;
