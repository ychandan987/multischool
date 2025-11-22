// src/app.js
require('dotenv').config();
const express = require('express');
const app = express();
const { sequelize, Role } = require('./models');

app.use(express.json());

// routes
const authRoutes = require('./routes/auth');
const schoolsRoutes = require('./routes/schools');
const usersRoutes = require('./routes/users'); // mounted at /schools/:schoolId/users
const usersRoot = require('./routes/usersRoot'); // /users/:id
const studentsRoutes = require('./routes/students');

app.use('/auth', authRoutes);
app.use('/schools', schoolsRoutes);
app.use('/schools/:schoolId/users', usersRoutes);
app.use('/schools/:schoolId/students', studentsRoutes);
app.use('/users', usersRoot);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

async function init() {
  await sequelize.sync({ alter: true }); // for dev. Use migrations in prod.

  // ensure roles exist
  const roles = ['superadmin', 'admin', 'user'];
  for (const r of roles) {
    await Role.findOrCreate({ where: { name: r } });
  }

  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
}

init();

module.exports = app; // for tests
