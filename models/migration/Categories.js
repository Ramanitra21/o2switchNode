// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const CategoryPublics = sequelize.define('CategoryPublics', {
//   id_publics: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   descri_public: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//     unique: true,
//   },
// }, {
//   tableName: 'category_publics',
//   timestamps: false,
// });

// const CategoryLieuxConsultation = sequelize.define('CategoryLieuxConsultation', {
//   id_lieux_consultation: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   descri_lieux_consultation: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//     unique: true,
//   },
// }, {
//   tableName: 'category_lieux_consultation',
//   timestamps: false,
// });

// const CategoryTypeConsultation = sequelize.define('CategoryTypeConsultation', {
//   id_type_consultation: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   nom_type_consultation: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//     unique: true,
//   },
// }, {
//   tableName: 'category_type_consultation',
//   timestamps: false,
// });

// module.exports = { CategoryPublics, CategoryLieuxConsultation, CategoryTypeConsultation };