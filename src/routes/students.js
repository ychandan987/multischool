// src/routes/students.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const { Student } = require("../models");
const auth = require("../middlewares/auth");
const { isSuperAdmin, isSchoolAdminOf, isSameSchool } = require("../middlewares/rbac");
const validate = require("../middlewares/validate");
const { createStudentSchema, updateStudentSchema } = require("../validators/student");

router.use(auth);

/**
 * Permission Logic:
 * Superadmin → All schools
 * School admin → Only their school
 * Staff with canEditStudents=true → Only their school
 */
function canEdit(user, schoolId) {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  if (isSchoolAdminOf(user, schoolId)) return true;
  if (isSameSchool(user, schoolId) && user.canEditStudents) return true;
  return false;
}

//
// POST /schools/:schoolId/students — create student
//
router.post(
  "/",
  validate(createStudentSchema),
  async (req, res) => {
    const schoolId = Number(req.params.schoolId);

    if (!canEdit(req.user, schoolId)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    try {
      const student = await Student.create({ ...req.body, schoolId });
      return res.status(201).json({ success: true, data: student });
    } catch (err) {
      console.error("Error creating student:", err);
      return res.status(500).json({ success: false, message: "Failed to create student" });
    }
  }
);

//
// GET /schools/:schoolId/students — list students
//
router.get("/", async (req, res) => {
  const schoolId = Number(req.params.schoolId);

  // Only superadmin or same school users can view students
  if (!isSuperAdmin(req.user) && !isSameSchool(req.user, schoolId)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    const students = await Student.findAll({ where: { schoolId } });
    return res.json({ success: true, data: students });
  } catch (err) {
    console.error("Error fetching students:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch students" });
  }
});

//
// GET /schools/:schoolId/students/:id — get student
//
router.get("/:id", async (req, res) => {
  const schoolId = Number(req.params.schoolId);

  if (!isSuperAdmin(req.user) && !isSameSchool(req.user, schoolId)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    const student = await Student.findOne({
      where: { id: req.params.id, schoolId },
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    return res.json({ success: true, data: student });
  } catch (err) {
    console.error("Error fetching student:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch student" });
  }
});

//
// PUT /schools/:schoolId/students/:id — update student
//
router.put(
  "/:id",
  validate(updateStudentSchema),
  async (req, res) => {
    const schoolId = Number(req.params.schoolId);

    if (!canEdit(req.user, schoolId)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    try {
      const student = await Student.findOne({
        where: { id: req.params.id, schoolId },
      });

      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }

      await student.update(req.body);
      return res.json({ success: true, data: student });
    } catch (err) {
      console.error("Error updating student:", err);
      return res.status(500).json({ success: false, message: "Failed to update student" });
    }
  }
);

//
// DELETE /schools/:schoolId/students/:id — delete student
//
router.delete("/:id", async (req, res) => {
  const schoolId = Number(req.params.schoolId);

  if (!canEdit(req.user, schoolId)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    const student = await Student.findOne({
      where: { id: req.params.id, schoolId },
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    await student.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting student:", err);
    return res.status(500).json({ success: false, message: "Failed to delete student" });
  }
});

module.exports = router;
