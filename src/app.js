// src/app.js
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const app = express();

const { sequelize, Role } = require("./models");

// -----------------------------------------
// Middlewares
// -----------------------------------------

app.disable("x-powered-by"); // security

app.use(
  express.json({
    limit: "1mb", // prevent large payloads
  })
);

app.use(helmet()); // secure headers
app.use(cors());   // allow requests from frontend

// -----------------------------------------
// Routes
// -----------------------------------------

const authRoutes = require("./routes/auth");
const schoolsRoutes = require("./routes/schools");
const usersRoutes = require("./routes/users");
const usersRootRoutes = require("./routes/usersRoot");
const studentsRoutes = require("./routes/students");

app.use("/auth", authRoutes);
app.use("/schools", schoolsRoutes);

// Important: more specific routes come before root-level routes
app.use("/schools/:schoolId/users", usersRoutes);
app.use("/schools/:schoolId/students", studentsRoutes);

app.use("/users", usersRootRoutes);

// -----------------------------------------
// Global Error Handler
// -----------------------------------------
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);

  return res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

// -----------------------------------------
// Initialization
// -----------------------------------------

const PORT = process.env.PORT || 3000;

async function init() {
  try {
    // Sync ONLY in development
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
    }

    // Ensure default roles
    const defaultRoles = ["superadmin", "admin", "user"];
    for (const roleName of defaultRoles) {
      await Role.findOrCreate({ where: { name: roleName } });
    }

    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, () =>
        console.log(`Server running on port ${PORT}`)
      );
    }
  } catch (err) {
    console.error("Failed to initialize server:", err);
    process.exit(1);
  }
}

init();

module.exports = app; // for tests
