const { sequelize } = require('../src/models');

module.exports = async function setup() {
  await sequelize.sync({ force: true });
};