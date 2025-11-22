// src/tests/users.test.js
const request = require("supertest");
const app = require("../app");
const { sequelize, Role, School, User } = require("../models");
const bcrypt = require("bcrypt");
const { generateOnboardingPassword } = require("../services/userService");

// disable email sending during tests
process.env.SEND_EMAILS = "false";

let adminToken;
let schoolId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // create roles
  const roles = await Role.bulkCreate([
    { name: "superadmin" },
    { name: "admin" },
    { name: "user" },
  ]);

  const superRole = roles.find((r) => r.name === "superadmin");

  // deterministic password
  const fixedDate = new Date("2024-01-01");
  const plainPassword = generateOnboardingPassword(
    "9999999999",
    "Super Admin",
    fixedDate
  );

  const phash = await bcrypt.hash(plainPassword, 10);

  // create superadmin
  await User.create({
    name: "Super Admin",
    email: "super@erp.test",
    phone: "9999999999",
    password_hash: phash,
    roleId: superRole.id,
    schoolId: null,
  });

  // login for token
  const login = await request(app).post("/auth/login").send({
    email: "super@erp.test",
    password: plainPassword,
  });

  adminToken = login.body.token;

  // create school
  const schoolResp = await request(app)
    .post("/schools")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ name: "Test School" });

  // improved /schools returns { success, data: {...} }
  schoolId = schoolResp.body.data.id;
});

afterAll(async () => {
  await sequelize.close();
});

test("superadmin can create user in school", async () => {
  const newUser = {
    name: "Alice",
    email: "alice@test.com",
    phone: "1112223333",
    roleId: null, // user role doesn't matter here if service assigns or validate
    canEditStudents: true,
  };

  const resp = await request(app)
    .post(`/schools/${schoolId}/users`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send(newUser);

  expect(resp.status).toBe(201);
  expect(resp.body.data).toBeDefined();
  expect(resp.body.data.email).toBe("alice@test.com");

  // verify in DB
  const dbUser = await User.findOne({ where: { email: "alice@test.com" } });
  expect(dbUser).not.toBeNull();
  expect(dbUser.phone).toBe("1112223333");
});
