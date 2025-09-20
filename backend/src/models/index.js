const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const UserModel = require('./User');
const ProductModel = require('./Product');
const InvestmentModel = require('./Investment');
const TransactionLogModel = require('./TransactionLog');
const PasswordResetModel = require('./PasswordReset');

const User = UserModel(sequelize, DataTypes);
const Product = ProductModel(sequelize, DataTypes);
const Investment = InvestmentModel(sequelize, DataTypes);
const TransactionLog = TransactionLogModel(sequelize, DataTypes);
const PasswordReset = PasswordResetModel(sequelize, DataTypes);

// Associations
User.hasMany(Investment, { foreignKey: 'userId' });
Investment.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Investment, { foreignKey: 'productId' });
Investment.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(TransactionLog, { foreignKey: 'userId' });
TransactionLog.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(PasswordReset, { foreignKey: 'userId' });
PasswordReset.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Product,
  Investment,
  TransactionLog,
  PasswordReset
};
