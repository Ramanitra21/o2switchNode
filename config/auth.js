const tokens = new Map(); // Map pour stocker les tokens et leurs dates d'expiration
const TOKEN_LIFETIME = 24 * 60 * 60 * 1000; // Durée de vie du token en millisecondes (24 heures)

// Fonction pour générer un token aléatoire de 20 caractères
function generateToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 20; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    const expiration = Date.now() + TOKEN_LIFETIME;
    tokens.set(token, expiration); // Ajouter le token avec sa date d'expiration
    return token;
}

// Fonction pour vérifier si un token est valide
function isTokenValid(token) {
    if (tokens.has(token)) {
        const expiration = tokens.get(token);
        if (Date.now() < expiration) {
            return true; // Le token est encore valide
        } else {
            tokens.delete(token); // Supprimer le token expiré
        }
    }
    return false; // Token invalide ou expiré
}

// Middleware pour vérifier le token
function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    if (isTokenValid(token)) {
        return next(); // Le token est valide, passer à la route suivante
    } else {
        return res.status(403).json({ message: 'Token invalide ou expiré' });
    }
}

// Exporter les fonctions
module.exports = {
    generateToken,
    authMiddleware,
    isTokenValid
};
