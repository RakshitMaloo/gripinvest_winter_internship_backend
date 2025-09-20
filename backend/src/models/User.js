module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
    balance: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.0 },
    risk_appetite: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' }
  }, { timestamps: true });
};
