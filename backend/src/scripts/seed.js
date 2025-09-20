const bcrypt = require('bcryptjs');
const { sequelize, User, Product } = require('../models');

async function run() {
  await sequelize.sync({ alter: true });
  const adminPw = await bcrypt.hash('Admin@123', 10);
  const userPw = await bcrypt.hash('User@123', 10);
  await User.findOrCreate({ where: { email: 'admin@example.com' }, defaults: { name: 'Admin', password: adminPw, role: 'admin', balance: 100000 } });
  await User.findOrCreate({ where: { email: 'user@example.com' }, defaults: { name: 'Demo User', password: userPw, role: 'user', balance: 10000 } });

  await Product.findOrCreate({ where: { title: 'Bluechip Income Fund' }, defaults: { category: 'Equity', min_amount: 1000, max_amount: 500000, return_rate: 10.5, risk_level: 'low', description: 'Stable bluechip returns.' } });
  await Product.findOrCreate({ where: { title: 'High Yield Venture' }, defaults: { category: 'Venture', min_amount: 5000, max_amount: 200000, return_rate: 20, risk_level: 'high', description: 'High yield, high risk.' } });
  await Product.findOrCreate({ where: { title: 'Balanced Growth' }, defaults: { category: 'Hybrid', min_amount: 500, max_amount: 100000, return_rate: 12, risk_level: 'medium', description: 'Balanced allocation for steady growth.' } });

  console.log('Seeding done');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
