const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const authenticateJWT = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User registration/login
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login as existing user
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 */
router.get('/me', authenticateJWT, authController.me);

module.exports = router;
