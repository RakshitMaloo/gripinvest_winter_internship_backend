const { TransactionLog } = require('../models');
const aiService = require('../utils/aiService');
const { Op } = require('sequelize');

module.exports = {
  getLogsForUser: async (req, res, next) => {
    try {
      const { userId, email } = req.query;
      const where = {};
      if (userId) where.userId = userId;
      if (email) where.email = email;
      const logs = await TransactionLog.findAll({ where, order: [['createdAt','DESC']], limit: 200 });
      res.json(logs);
    } catch (err) { next(err); }
  },

  summarizeErrorsForUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const logs = await TransactionLog.findAll({ where: { userId, statusCode: { [Op.gte]: 400 } } });
      const summary = await aiService.summarizeErrors(logs.map(l => ({ endpoint: l.endpoint, statusCode: l.statusCode, errorMessage: l.errorMessage })));
      res.json({ summary });
    } catch (err) { next(err); }
  }
};
