// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const PraticienInfo = sequelize.define('PraticienInfo', {
//   id_prat_det: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   numero_ciret: {
//     type: DataTypes.INTEGER,
//     unique: true,
//   },
//   monney: {
//     type: DataTypes.STRING(50),
//     allowNull: false,
//   },
//   id_users: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// }, {
//   tableName: 'praticien_info',
//   timestamps: false,
// });

// const PraticienAdresseConsultation = sequelize.define('PraticienAdresseConsultation', {
//   id_prat_adr: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   adresse: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//   },
//   id_prat_det: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// }, {
//   tableName: 'praticien_adresse_consultation',
//   timestamps: false,
// });

// const PraticienLieuxConsultation = sequelize.define('PraticienLieuxConsultation', {
//   id_prat_lieux: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   id_lieux_consultation: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   id_prat_adr: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// }, {
//   tableName: 'praticien_lieux_consultation',
//   timestamps: false,
// });

// const PraticienTypeConsultation = sequelize.define('PraticienTypeConsultation', {
//   id_prat_consultation: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   id_type_consultation: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   id_prat_adr: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// }, {
//   tableName: 'praticien_type_consultation',
//   timestamps: false,
// });

// const PraticienPublics = sequelize.define('PraticienPublics', {
//   id_prat_public: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   id_publics: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   id_prat_adr: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// }, {
//   tableName: 'praticien_publics',
//   timestamps: false,
// });

// module.exports = { PraticienInfo, PraticienAdresseConsultation, PraticienLieuxConsultation, PraticienTypeConsultation, PraticienPublics };