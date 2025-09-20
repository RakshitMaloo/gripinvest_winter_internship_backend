process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../src/server');
const { sequelize, Product, User } = require('../src/models');
const bcrypt = require('bcryptjs');

let adminToken;
beforeAll(async () => {
  await sequelize.sync({ force: true });
  const adminPw = await bcrypt.hash('Admin@123', 10);
  const admin = await User.create({ name: 'Admin', email: 'admin@test', password: adminPw, role: 'admin' });
  // login to get token
  const res = await request(app).post('/api/auth/login').send({ email: 'admin@test', password: 'Admin@123' });
  adminToken = res.body.token;
});

afterAll(async () => { await sequelize.close(); });

describe('Products endpoints', () => {
  it('GET /api/products should return array', async () => {
    await Product.create({ title: 'P1', description: 'd1', return_rate: 10 });
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('POST /api/products (admin) should create product', async () => {
    const res = await request(app).post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'NewP', category: 'Equity', return_rate: 9 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });
});
