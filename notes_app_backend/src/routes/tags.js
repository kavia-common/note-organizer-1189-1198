const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tags');
const authenticateJWT = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: Tags
 *     description: Note tags and organization
 */

router.get('/', authenticateJWT, tagsController.getAll);
router.post('/', authenticateJWT, tagsController.create);

module.exports = router;
