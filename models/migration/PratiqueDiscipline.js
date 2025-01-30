// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Discipline = sequelize.define('Discipline', {
//   id_dsp: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   nom_dsp: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//     unique: true,
//   },
// }, {
//   tableName: 'discipline',
//   timestamps: false,
// });

// const Pratiques = sequelize.define('Pratiques', {
//   id_pratique: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   nom_pratique: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//   },
//   desc_pratique: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   date_pratique: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   tarif: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false,
//   },
//   duree: {
//     type: DataTypes.DECIMAL(3, 2),
//     allowNull: false,
//   },
//   id_prat_det: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   id_dsp: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// }, {
//   tableName: 'pratiques',
//   timestamps: false,
// });

// const HorairePratique = sequelize.define('HorairePratique', {
//   id_horaire: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   heure_debut: {
//     type: DataTypes.TIME,
//     allowNull: false,
//   },
//   heure_fin: {
//     type: DataTypes.TIME,
//     allowNull: false,
//   },
//   id_corresp: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   id_pratique: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// }, {
//   tableName: 'horaire_pratique',
//   timestamps: false,
// });

// module.exports = { Discipline, Pratiques, HorairePratique };