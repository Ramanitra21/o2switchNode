const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TypeUser = sequelize.define('TypeUser', {
  id_type_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'type_user',
  timestamps: false,
});

module.exports = TypeUser;