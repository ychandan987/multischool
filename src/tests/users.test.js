// src/tests/users.test.js
const request = require('supertest');
const app = require('../app');
const { sequelize, Role, School, User } = require('../models');
const { generatePassword } = require('../services/userService');
const bcrypt = require('bcrypt');

let adminToken;
let schoolId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const [r1, r2, r3] = await Role.bulkCreate([{ name: 'superadmin' }, { name: 'admin' }, { name: 'user' }]);
  // create superadmin
  const pass = generatePassword('9999999999', 'Super Admin', new Date());
  const phash = await bcrypt.hash(pass, 10);
  const sup = await User.create({ name: 'Super Admin', email: 'super@erp.test', phone: '9999999999', password_hash: phash, roleId: 1 });
  const login = await request(app).post('/auth/login').send({ email: 'super@erp.test', password: pass });
  adminToken = login.body.token;

  // create a school
  const schoolResp = await request(app)
    .post('/schools')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Test School' });
  schoolId = schoolResp.body.id;
});

test('superadmin can create user and email contains generated password', async () => {
  const newUser = { name: 'Alice', email: 'alice@test.com', phone: '1112223333', roleId: 3, canEditStudents: true };
  const resp = await request(app)
    .post(`/schools/${schoolId}/users`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send(newUser);

  expect(resp.status).toBe(201);
  expect(resp.body.email).toBe('alice@test.com');

  // you can also check DB for created user
  const dbUser = await User.findOne({ where: { email: 'alice@test.com' } });
  expect(dbUser).toBeTruthy();
});
