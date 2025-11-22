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

app.disable("x-powered-by");

app.use(
  express.json({
    limit: "1mb",
  })
);

// Handle simple form submissions (optional)
app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// Security headers
app.use(helmet());

// Frontend access
app.use(cors());

// Development request logger (optional)
if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// -----------------------------------------
// Routes
// -----------------------------------------

const authRoutes = require("./routes/auth");
const schoolsRoutes = require("./routes/schools");
const usersRoutes = require("./routes/users");
const usersRoot = require("./routes/usersRoot");
const studentsRoutes = require("./routes/students");

app.use("/auth", authRoutes);
app.use("/schools", schoolsRoutes);

app.use("/schools/:schoolId/users", usersRoutes);
app.use("/schools/:schoolId/students", studentsRoutes);

app.use("/users", usersRoot);

// -----------------------------------------
// Error Handler
// -----------------------------------------
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled Error:", err);

  res.status(err.status || 500).json({
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
    // Only sync in dev/test
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
    }

    // Ensure default roles
    const defaultRoles = ["superadmin", "admin", "user"];
    for (const r of defaultRoles) {
      await Role.findOrCreate({ where: { name: r } });
    }

    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, () =>
        console.log(`🚀 Server running on port ${PORT}`)
      );
    }
  } catch (err) {
    console.error("❌ Failed to initialize server:", err);
    process.exit(1);
  }
}

init();

// Graceful shutdown (optional)
process.on("SIGTERM", () => console.log("SIGTERM received, shutting down..."));
process.on("SIGINT", () => console.log("SIGINT received, shutting down..."));

module.exports = app;
