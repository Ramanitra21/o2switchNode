const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../config/auth');
const userController = require('../controllers/userController');


router.get('/private', authMiddleware, (req, res) => {
    res.send(`Bienvenue dans la route protégée, utilisateur`);
});

router.post('/login', userController.loginUser);

module.exports = router;