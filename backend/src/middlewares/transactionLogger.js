const { TransactionLog } = require('../models');

module.exports = function transactionLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', async () => {
    try {
      await TransactionLog.create({
        userId: req.user?.id || null,
        email: req.user?.email || null,
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        errorMessage: res.locals.errorMessage || null,
        meta: { durationMs: Date.now() - start }
      });
    } catch (err) {
      console.error('Failed to write transaction log', err);
    }
  });
  next();
};
