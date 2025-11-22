// src/routes/students.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const { Student } = require('../models');
const auth = require('../middlewares/auth');
const { isSuperAdmin, isSchoolAdminOf } = require('../middlewares/rbac');
const validate = require('../middlewares/validate');
const { createStudentSchema, updateStudentSchema } = require('../validators/student');

router.use(auth);

function canEdit(req) {
  // allowed if superadmin, school admin of the school, or user with canEditStudents true in same school
  const user = req.user;
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  if (isSchoolAdminOf(user, req.params.schoolId)) return true;
  if (user.schoolId === Number(req.params.schoolId) && user.canEditStudents === true) return true;
  return false;
}

router.post('/', validate(createStudentSchema), async (req, res) => {
  if (!canEdit(req)) return res.status(403).json({ message: 'Forbidden' });
  const { schoolId } = req.params;
  const student = await Student.create({ ...req.body, schoolId });
  res.status(201).json(student);
});

router.get('/', async (req, res) => {
  const { schoolId } = req.params;
  // scoped list
  const students = await Student.findAll({ where: { schoolId } });
  res.json(students);
});

router.get('/:id', async (req, res) => {
  const student = await Student.findOne({ where: { id: req.params.id, schoolId: req.params.schoolId } });
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
});

router.put('/:id', validate(updateStudentSchema), async (req, res) => {
  if (!canEdit(req)) return res.status(403).json({ message: 'Forbidden' });
  const student = await Student.findOne({ where: { id: req.params.id, schoolId: req.params.schoolId } });
  if (!student) return res.status(404).json({ message: 'Student not found' });
  await student.update(req.body);
  res.json(student);
});

router.delete('/:id', async (req, res) => {
  if (!canEdit(req)) return res.status(403).json({ message: 'Forbidden' });
  const student = await Student.findOne({ where: { id: req.params.id, schoolId: req.params.schoolId } });
  if (!student) return res.status(404).json({ message: 'Student not found' });
  await student.destroy();
  res.status(204).send();
});

module.exports = router;
