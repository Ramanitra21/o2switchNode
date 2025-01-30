// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Notification = sequelize.define('Notification', {
//   id_notif: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   type_notif: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   message: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   date_notif: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   id_rdv: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// }, {
//   tableName: 'notification',
//   timestamps: false,
// });

// module.exports = { Notification };