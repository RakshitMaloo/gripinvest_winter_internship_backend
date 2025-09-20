module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING },
    min_amount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 100.0 },
    max_amount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 100000.0 },
    return_rate: { type: DataTypes.FLOAT, defaultValue: 8.0 },
    risk_level: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' },
    description: { type: DataTypes.TEXT },
    available: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { timestamps: true });
};
