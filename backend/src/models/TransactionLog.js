module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TransactionLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    endpoint: { type: DataTypes.STRING, allowNull: false },
    method: { type: DataTypes.STRING, allowNull: false },
    statusCode: { type: DataTypes.INTEGER },
    errorMessage: { type: DataTypes.TEXT },
    meta: { type: DataTypes.JSON }
  }, { timestamps: true, createdAt: true, updatedAt: false });
};
