// src/routes/schools.js
const express = require("express");
const router = express.Router();
const { School } = require("../models");
const auth = require("../middlewares/auth");
const { requireRoles } = require("../middlewares/rbac");
const validate = require("../middlewares/validate");
const { createSchoolSchema } = require("../validators/school");

router.use(auth);

//
// GET /schools — list all schools (superadmin only)
//
router.get("/", requireRoles("superadmin"), async (req, res) => {
  try {
    const schools = await School.findAll();
    return res.json({
      success: true,
      data: schools,
    });
  } catch (err) {
    console.error("Error fetching schools:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch schools",
    });
  }
});

//
// POST /schools — create a school (superadmin only)
//
router.post(
  "/",
  requireRoles("superadmin"),
  validate(createSchoolSchema),
  async (req, res) => {
    try {
      const school = await School.create(req.body);
      return res.status(201).json({
        success: true,
        message: "School created successfully",
        data: school,
      });
    } catch (err) {
      console.error("Error creating school:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to create school",
      });
    }
  }
);

//
// GET /schools/:id — get single school (superadmin only)
//
router.get("/:id", requireRoles("superadmin"), async (req, res) => {
  try {
    const school = await School.findByPk(req.params.id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    return res.json({
      success: true,
      data: school,
    });
  } catch (err) {
    console.error("Error fetching school:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch school",
    });
  }
});

module.exports = router;
