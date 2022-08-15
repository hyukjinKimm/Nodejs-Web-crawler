const Sequelize = require('sequelize');

module.exports = class Proxy extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      ip: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true
      },
      type: {
         type: Sequelize.STRING(20),
         allowNull: false,
      },
      uptime: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Proxy',
      tableName: 'proxys',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
  }
}