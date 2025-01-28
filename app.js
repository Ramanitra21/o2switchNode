const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Clé secrète pour signer le token
const SECRET_KEY = 'votre_cle_secrete_super_securisee';

// Fonction pour encoder en Base64
const base64Encode = (data) => {
  return Buffer.from(JSON.stringify(data)).toString('base64url');
};

// Fonction pour générer un JWT
const generateToken = (payload, secret, expiresIn = '1h') => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  // Expiration en timestamp
  const expiration = Math.floor(Date.now() / 1000) + (expiresIn === '1h' ? 3600 : parseInt(expiresIn));
  payload.exp = expiration;

  // Encodage Header et Payload
  const headerBase64 = base64Encode(header);
  const payloadBase64 = base64Encode(payload);

  // Signature
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${headerBase64}.${payloadBase64}`)
    .digest('base64url');

  // Token final
  return `${headerBase64}.${payloadBase64}.${signature}`;
};

// Fonction pour vérifier un JWT
const verifyToken = (token, secret) => {
  try {
    const [headerBase64, payloadBase64, signature] = token.split('.');

    // Regénérer la signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${headerBase64}.${payloadBase64}`)
      .digest('base64url');

    // Vérifier la signature
    if (expectedSignature !== signature) {
      throw new Error('Signature invalide');
    }

    // Vérifier la date d'expiration
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expiré');
    }

    return payload; // Retourne les données du token si tout est valide
  } catch (err) {
    return null; // Renvoie null si le token est invalide
  }
};

// Route pour générer un token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Exemple de validation des identifiants
  if (username === 'admin' && password === 'password') {
    const token = generateToken({ username, role: 'admin' }, SECRET_KEY);
    res.json({ token });
  } else {
    res.status(401).send('Identifiants incorrects');
  }
});

// Middleware pour protéger les routes
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Accès refusé, token manquant');
  }

  const payload = verifyToken(token, SECRET_KEY);

  if (!payload) {
    return res.status(403).send('Token invalide ou expiré');
  }

  req.user = payload; // Ajouter les données utilisateur à req
  next();
};

// Route protégée
app.get('/dashboard', authenticate, (req, res) => {
  res.send(`Bienvenue ${req.user.username}, vous avez accès au tableau de bord!`);
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
