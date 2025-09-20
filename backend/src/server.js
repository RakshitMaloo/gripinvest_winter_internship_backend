const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { sequelize } = require('./models');
const transactionLogger = require('./middlewares/transactionLogger');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const investmentRoutes = require('./routes/investments');
const logRoutes = require('./routes/logs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(transactionLogger);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/logs', logRoutes);


// Health endpoint
app.get('/api/health', async (req, res) => {
  try {
    // test DB connection
    await require('./models').sequelize.authenticate();
    res.json({ status: 'ok', uptime: process.uptime() });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.locals.errorMessage = err.message;
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

async function start() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}

if (require.main === module) {
  start().catch(err => { console.error('Failed to start', err); process.exit(1); });
} else {
  module.exports = app;
}
