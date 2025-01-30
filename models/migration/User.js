// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const User = sequelize.define('User', {
//   id_users: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   user_name: {
//     type: DataTypes.STRING(100),
//   },
//   user_forname: {
//     type: DataTypes.STRING(100),
//   },
//   adresse: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//   },
//   code_postal: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   ville: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//   },
//   user_created_at: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   user_date_naissance: {
//     type: DataTypes.DATE,
//   },
//   user_mail: {
//     type: DataTypes.STRING(100),
//     allowNull: false,
//     unique: true,
//   },
//   user_phone: {
//     type: DataTypes.STRING(100),
//     allowNull: false,
//     unique: true,
//   },
//   user_photo_url: {
//     type: DataTypes.TEXT,
//   },
//   id_type_user: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// }, {
//   tableName: 'users',
//   timestamps: false,
// });

// module.exports = User;