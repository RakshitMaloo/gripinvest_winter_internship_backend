module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Investment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    investedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('active', 'closed'), defaultValue: 'active' },
    estimated_returns: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.0 }
  }, { timestamps: true });
};
