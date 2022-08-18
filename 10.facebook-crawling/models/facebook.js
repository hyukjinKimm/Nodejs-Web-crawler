const Sequelize = require('sequelize');

module.exports = class Facebook extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      media: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      content: {
         type: Sequelize.TEXT,
         allowNull: true,
      },
      writer: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Facebook',
      tableName: 'facebooks',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
  }
}