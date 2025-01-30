// const sequelize = require('../config/database');
// const { TypeUser } = require('./TypeUser');
// const { User } = require('./User');
// const { CategoryPublics, CategoryLieuxConsultation, CategoryTypeConsultation } = require('./Categories');
// const { PraticienInfo, PraticienAdresseConsultation, PraticienLieuxConsultation, PraticienTypeConsultation, PraticienPublics } = require('./Praticien');
// const { Discipline, Pratiques, HorairePratique } = require('./PratiqueDiscipline');
// const { RendezVous, CreneauxDisponibilite, LogRdv } = require('./RendezVous');
// const { Notification } = require('./NotificationLog');
// const { JoursCorrespondance } = require('./JoursCorrespondance');

// // Define associations
// TypeUser.hasMany(User, { foreignKey: 'id_type_user' });
// User.belongsTo(TypeUser, { foreignKey: 'id_type_user' });

// User.hasOne(PraticienInfo, { foreignKey: 'id_users' });
// PraticienInfo.belongsTo(User, { foreignKey: 'id_users' });

// PraticienInfo.hasMany(PraticienAdresseConsultation, { foreignKey: 'id_prat_det' });
// PraticienAdresseConsultation.belongsTo(PraticienInfo, { foreignKey: 'id_prat_det' });

// PraticienAdresseConsultation.hasMany(PraticienLieuxConsultation, { foreignKey: 'id_prat_adr' });
// PraticienLieuxConsultation.belongsTo(PraticienAdresseConsultation, { foreignKey: 'id_prat_adr' });

// PraticienAdresseConsultation.hasMany(PraticienTypeConsultation, { foreignKey: 'id_prat_adr' });
// PraticienTypeConsultation.belongsTo(PraticienAdresseConsultation, { foreignKey: 'id_prat_adr' });

// PraticienAdresseConsultation.hasMany(PraticienPublics, { foreignKey: 'id_prat_adr' });
// PraticienPublics.belongsTo(PraticienAdresseConsultation, { foreignKey: 'id_prat_adr' });

// Discipline.hasMany(Pratiques, { foreignKey: 'id_dsp' });
// Pratiques.belongsTo(Discipline, { foreignKey: 'id_dsp' });

// Pratiques.hasMany(HorairePratique, { foreignKey: 'id_pratique' });
// HorairePratique.belongsTo(Pratiques, { foreignKey: 'id_pratique' });

// Pratiques.hasMany(CreneauxDisponibilite, { foreignKey: 'id_pratique' });
// CreneauxDisponibilite.belongsTo(Pratiques, { foreignKey: 'id_pratique' });

// Pratiques.hasMany(RendezVous, { foreignKey: 'id_pratique' });
// RendezVous.belongsTo(Pratiques, { foreignKey: 'id_pratique' });

// User.hasMany(RendezVous, { foreignKey: 'id_users' });
// RendezVous.belongsTo(User, { foreignKey: 'id_users' });

// RendezVous.hasMany(LogRdv, { foreignKey: 'id_rdv' });
// LogRdv.belongsTo(RendezVous, { foreignKey: 'id_rdv' });

// RendezVous.hasMany(Notification, { foreignKey: 'id_rdv' });
// Notification.belongsTo(RendezVous, { foreignKey: 'id_rdv' });

// JoursCorrespondance.hasMany(HorairePratique, { foreignKey: 'id_corresp' });
// HorairePratique.belongsTo(JoursCorrespondance, { foreignKey: 'id_corresp' });

// module.exports = {
//   sequelize,
//   TypeUser,
//   User,
//   CategoryPublics,
//   CategoryLieuxConsultation,
//   CategoryTypeConsultation,
//   PraticienInfo,
//   PraticienAdresseConsultation,
//   PraticienLieuxConsultation,
//   PraticienTypeConsultation,
//   PraticienPublics,
//   Discipline,
//   Pratiques,
//   HorairePratique,
//   RendezVous,
//   CreneauxDisponibilite,
//   LogRdv,
//   Notification,
//   JoursCorrespondance,
// };