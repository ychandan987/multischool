// src/tests/auth.test.js
const request = require('supertest');
const app = require('../app');
const { sequelize, Role, User } = require('../models');
const { generatePassword } = require('../services/userService');
const bcrypt = require('bcrypt');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Role.bulkCreate([{ name: 'superadmin' }, { name: 'admin' }, { name: 'user' }]);

  const pass = generatePassword('9999999999', 'Super Admin', new Date());
  const phash = await bcrypt.hash(pass, 10);
  await User.create({ name: 'Super Admin', email: 'super@erp.test', phone: '9999999999', password_hash: phash, roleId: 1, schoolId: null });
});

afterAll(async () => {
  await sequelize.close();
});

test('login with correct credentials returns token', async () => {
  const resp = await request(app).post('/auth/login').send({
    email: 'super@erp.test',
    password: generatePassword('9999999999','Super Admin', new Date())
  });
  expect(resp.status).toBe(200);
  expect(resp.body.token).toBeDefined();
});
