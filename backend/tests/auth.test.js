process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../src/server'); // server exports app when required
const { sequelize, User } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth endpoints', () => {
  it('POST /api/auth/signup -> should create user and return token', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Test', email: 't1@example.com', password: 'Test@1234' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/auth/login -> login with seeded user', async () => {
    // create user
    await User.create({ name: 'L', email: 'login@example.com', password: await require('bcryptjs').hash('Pass@1234', 10) });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'Pass@1234' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
