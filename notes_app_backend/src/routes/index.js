const express = require('express');
const healthController = require('../controllers/health');

const authRoutes = require('./auth');
const notesRoutes = require('./notes');
const tagsRoutes = require('./tags');

const router = express.Router();

/**
 * Health endpoint (see OpenAPI).
 */
router.get('/', healthController.check.bind(healthController));

// Main routes
router.use('/auth', authRoutes);
router.use('/notes', notesRoutes);
router.use('/tags', tagsRoutes);

module.exports = router;
