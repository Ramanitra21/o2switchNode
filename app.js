const express = require('express');
const { generateToken, authMiddleware } = require('./config/auth');
const app = express();
app.use(express.json());

// Identifiants pour le login
const adminCredentials = {
    username: 'admin',
    password: 'password'
};

// Route pour le login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: 'Nom d’utilisateur ou mot de passe manquant' });
    } else {
        if (username === adminCredentials.username && password === adminCredentials.password) {
            const token = generateToken();
            res.json({ message: 'Connexion réussie', token });
        } else {
            res.status(401).json({ message: 'Nom d’utilisateur ou mot de passe incorrect' });
        }
    }
});

// Route protégée
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Vous avez accédé à une route protégée' });
});

// Route pour tester
app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur Node.js');
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
