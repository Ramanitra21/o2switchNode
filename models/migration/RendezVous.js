// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const RendezVous = sequelize.define('RendezVous', {
//   id_rdv: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   date_rdv: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   heure_rdv: {
//     type: DataTypes.TIME,
//     allowNull: false,
//   },
//   motif_rdv: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   status_rdv: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   date_ajout_rdv: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   date_modif_rdv: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   id_pratique: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   id_users: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   id_users_1: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// }, {
//   tableName: 'rendez_vous',
//   timestamps: false,
// });

// const CreneauxDisponibilite = sequelize.define('CreneauxDisponibilite', {
//   id_crn: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   date_dispo: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   heure_debut_dispo: {
//     type: DataTypes.TIME,
//     allowNull: false,
//   },
//   heure_fin_dispo: {
//     type: DataTypes.TIME,
//     allowNull: false,
//   },
//   status: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   date_ajout_dispo: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   id_pratique: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// }, {
//   tableName: 'creneaux_disponibilite',
//   timestamps: false,
// });

// const LogRdv = sequelize.define('LogRdv', {
//   id_log_rdv: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   date_ajout_log: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   id_users: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   id_rdv: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// }, {
//   tableName: 'log_rdv',
//   timestamps: false,
// });

// module.exports = { RendezVous, CreneauxDisponibilite, LogRdv };