const express = require('express');
const route = require('./route/routes')
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());

app.use(bodyParser.json());

app.use('/api', route);
// Route pour tester
app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur Node.js');
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
