// src/routes/users.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const { User, Role, School } = require('../models');
const auth = require('../middlewares/auth');
const { isSuperAdmin, isSchoolAdminOf } = require('../middlewares/rbac');
const validate = require('../middlewares/validate');
const { createUserSchema, updateUserSchema } = require('../validators/user');
const { createUser } = require('../services/userService');

router.use(auth);

// create user for a school (superadmin or that school's admin)
router.post('/', validate(createUserSchema), async (req, res) => {
  const { schoolId } = req.params;
  const caller = req.user;

  // only superadmin or school admin of that school
  if (!(isSuperAdmin(caller) || isSchoolAdminOf(caller, schoolId))) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // ensure school exists
  const school = await School.findByPk(schoolId);
  if (!school) return res.status(404).json({ message: 'School not found' });

  const user = await createUser({ ...req.body, schoolId });
  // do not send password or password_hash in response
  const safe = (({ password_hash, ...u }) => u)(user.toJSON());
  res.status(201).json(safe);
});

// list users in a school
router.get('/', async (req, res) => {
  const { schoolId } = req.params;
  const caller = req.user;
  if (!(isSuperAdmin(caller) || isSchoolAdminOf(caller, schoolId))) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const users = await User.findAll({ where: { schoolId }, include: Role });
  res.json(users.map(u => {
    const json = u.toJSON();
    delete json.password_hash;
    return json;
  }));
});

// get user profile
router.get('/../:id', async (req, res) => { /* we won't use this path; separate /users/:id route below */ });

module.exports = router;
