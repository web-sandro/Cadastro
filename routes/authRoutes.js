const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const authController = require('../controllers/authController');

router.get('/login', authController.loginForm);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/create-user/', (req, res) => {
    res.render('auth/create-user'); 
});
router.post('/create-user/', authController.createUser);

router.get('/forgot-password', (req, res) => {
    res.render('auth/forgot-password'); 
});
router.post('/forgot-password', authController.forgotPassword);


router.get('/reset-password', (req, res) => {
    res.render('auth/reset-password', { token: req.query.token }); 
});
router.post('/reset-password', authController.resetPassword);

module.exports = router;