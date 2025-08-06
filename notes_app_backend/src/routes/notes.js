const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes');
const authenticateJWT = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: Notes
 *     description: Note taking and management
 */

router.post('/', authenticateJWT, notesController.createNote);
router.get('/', authenticateJWT, notesController.getNotes);
router.get('/:id', authenticateJWT, notesController.getNoteById);
router.put('/:id', authenticateJWT, notesController.updateNote);
router.delete('/:id', authenticateJWT, notesController.deleteNote);

module.exports = router;
