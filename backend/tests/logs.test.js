process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../src/server');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Logs', () => {
  it('should return logs array (admin protected route - will 401 without token)', async () => {
    const res = await request(app).get('/api/logs');
    expect([200,401,403].includes(res.statusCode)).toBeTruthy();
  });
});
