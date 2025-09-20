const { Product } = require('../models');
const aiService = require('../utils/aiService');

module.exports = {
  createProduct: async (req, res, next) => {
    try {
      const data = req.body;
      if (!data.description) {
        data.description = await aiService.generateDescriptionFromFields(data);
      }
      const p = await Product.create(data);
      res.json(p);
    } catch (err) { next(err); }
  },

  updateProduct: async (req, res, next) => {
    try {
      const id = req.params.id;
      const p = await Product.findByPk(id);
      if (!p) return res.status(404).json({ message: 'Product not found' });
      await p.update(req.body);
      res.json(p);
    } catch (err) { next(err); }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const id = req.params.id;
      const p = await Product.findByPk(id);
      if (!p) return res.status(404).json({ message: 'Product not found' });
      await p.destroy();
      res.json({ message: 'Deleted' });
    } catch (err) { next(err); }
  },

  listProducts: async (req, res, next) => {
    try {
      const products = await Product.findAll({ where: { available: true } });
      res.json(products);
    } catch (err) { next(err); }
  }
};
