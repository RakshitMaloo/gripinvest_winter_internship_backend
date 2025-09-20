const { Investment, Product, User } = require('../models');

module.exports = {
  invest: async (req, res, next) => {
    try {
      const user = req.user;
      const { productId, amount } = req.body;
      const product = await Product.findByPk(productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      if (!product.available) return res.status(400).json({ message: 'Product not available' });
      if (parseFloat(amount) < parseFloat(product.min_amount) || parseFloat(amount) > parseFloat(product.max_amount)) {
        return res.status(400).json({ message: `Amount should be between ${product.min_amount} and ${product.max_amount}` });
      }
      if (parseFloat(user.balance) < parseFloat(amount)) return res.status(400).json({ message: 'Insufficient balance' });
      const estimated = (parseFloat(amount) * parseFloat(product.return_rate)) / 100;
      const inv = await Investment.create({ userId: user.id, productId: product.id, amount, estimated_returns: estimated });
      user.balance = parseFloat(user.balance) - parseFloat(amount);
      await user.save();
      res.json({ investment: inv });
    } catch (err) { next(err); }
  },

  getPortfolio: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const investments = await Investment.findAll({ where: { userId }, include: [Product] });
      const totalInvested = investments.reduce((s, i) => s + parseFloat(i.amount), 0);
      const totalEstimatedReturns = investments.reduce((s, i) => s + parseFloat(i.estimated_returns), 0);
      res.json({ investments, totalInvested, totalEstimatedReturns });
    } catch (err) { next(err); }
  }
};
