process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../src/server');
const { sequelize, User, Product } = require('../src/models');
const bcrypt = require('bcryptjs');

let userToken;
let prodId;
beforeAll(async () => {
  await sequelize.sync({ force: true });
  const userPw = await bcrypt.hash('User@123', 10);
  const user = await User.create({ name: 'U', email: 'u@test', password: userPw, balance: 5000 });
  const login = await request(app).post('/api/auth/login').send({ email: 'u@test', password: 'User@123' });
  userToken = login.body.token;
  const p = await Product.create({ title: 'InvestMe', min_amount: 100, max_amount: 10000, return_rate: 10, description: 'x' });
  prodId = p.id;
});

afterAll(async () => { await sequelize.close(); });

describe('Investments', () => {
  it('POST /api/investments/invest should allow investment within balance', async () => {
    const res = await request(app).post('/api/investments/invest')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId: prodId, amount: 1000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.investment).toBeDefined();
  });

  it('GET /api/investments/portfolio returns investments', async () => {
    const res = await request(app).get('/api/investments/portfolio').set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('investments');
  });
});
