// src/tests/auth.test.js
const request = require("supertest");
const app = require("../app");
const { sequelize, Role, User } = require("../models");
const bcrypt = require("bcrypt");
const { generateOnboardingPassword } = require("../services/userService");

// Prevent actual email sending
process.env.SEND_EMAILS = "false";

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create roles
  const roles = await Role.bulkCreate([
    { name: "superadmin" },
    { name: "admin" },
    { name: "user" },
  ]);

  const superRole = roles.find((r) => r.name === "superadmin");

  // FIX: use fixed date so tests remain deterministic
  const fixedDate = new Date("2024-01-01");

  const plainPassword = generateOnboardingPassword(
    "9999999999",
    "Super Admin",
    fixedDate
  );

  const phash = await bcrypt.hash(plainPassword, 10);

  await User.create({
    name: "Super Admin",
    email: "super@erp.test",
    phone: "9999999999",
    password_hash: phash,
    roleId: superRole.id,
    schoolId: null,
  });

  // Make the fixed date accessible in tests
  global.__TEST_PASSWORD__ = plainPassword;
});

afterAll(async () => {
  await sequelize.close();
});

test("login with correct credentials returns token", async () => {
  const resp = await request(app).post("/auth/login").send({
    email: "super@erp.test",
    password: global.__TEST_PASSWORD__, // deterministic password
  });

  expect(resp.status).toBe(200);
  expect(resp.body.token).toBeDefined();
  expect(resp.body.user).toBeDefined();
  expect(resp.body.user.email).toBe("super@erp.test");
  expect(resp.body.user.role).toBe("superadmin");
});
