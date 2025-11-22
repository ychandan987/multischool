// src/routes/schools.js
const express = require('express');
const router = express.Router();
const { School } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const validate = require('../middlewares/validate');
const { createSchoolSchema } = require('../validators/school');

router.use(auth);

router.get('/', requireRole('superadmin'), async (req, res) => {
  const schools = await School.findAll();
  res.json(schools);
});

router.post('/', requireRole('superadmin'), validate(createSchoolSchema), async (req, res) => {
  const school = await School.create(req.body);
  res.status(201).json(school);
});

router.get('/:id', requireRole('superadmin'), async (req, res) => {
  const school = await School.findByPk(req.params.id);
  if (!school) return res.status(404).json({ message: 'School not found' });
  res.json(school);
});

module.exports = router;
