const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ✅ AUTH ROUTES (top priority)
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// ✅ SPECIFIC DATA ROUTES
router.get('/profile/:id', userController.getUserProfile);

// ✅ GENERAL ROUTES
router.get('/', userController.getAllUsers);

module.exports = router;