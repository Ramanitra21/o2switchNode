const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const secretKey = 'votre_clé_secrète';

app.use(express.json());

// Middleware personnalisé pour vérifier le JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extraire le token de l'en-tête

  if (!token) {
    return res.status(401).send('Accès refusé, token manquant!');
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Ajouter l'utilisateur décodé à la requête
    next(); // Passer à la route suivante
  } catch (err) {
    res.status(400).send('Token invalide!');
  }
};

// Route pour la génération du token
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validation des identifiants (simplifiée ici)
  if (username === 'admin' && password === 'password') {
    const user = { username };
    const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Identifiants incorrects');
  }
});

// Route protégée
app.get('/dashboard', authenticate, (req, res) => {
  res.send('Bienvenue sur votre tableau de bord!');
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur en cours d\'exécution sur le port 3000');
});
