/** @format */

const bcrypt = require("bcryptjs");

// Fonction pour hacher un mot de passe
exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Fonction pour comparer un mot de passe avec un hash
exports.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
