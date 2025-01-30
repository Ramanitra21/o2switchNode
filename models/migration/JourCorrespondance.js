const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JoursCorrespondance = sequelize.define('JoursCorrespondance', {
  id_corresp: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'jours_correspondance',
  timestamps: false,
});

// module.exports = JoursCorrespondance;