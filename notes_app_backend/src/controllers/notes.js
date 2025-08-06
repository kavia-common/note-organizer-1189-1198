const { Note, Tag, User } = require('../models');

// PUBLIC_INTERFACE
class NotesController {
  /**
   * Create a new note.
   * @route POST /notes
   */
  async createNote(req, res) {
    try {
      const { title, content, tags } = req.body;
      if (!content) return res.status(400).json({ error: 'Note content is required.' });

      const note = await Note.create({ userId: req.user.id, title, content });

      if (tags && Array.isArray(tags)) {
        // Attach tags, create any new tags as necessary
        await attachTagsToNote(note, tags);
      }
      const withTags = await Note.findByPk(note.id, { include: [{ model: Tag, as: 'tags' }] });
      res.status(201).json({ note: withTags });
    } catch (err) {
      console.error('Create note error:', err);
      res.status(500).json({ error: 'Failed to create note.' });
    }
  }

  /**
   * Get all notes for current user (optionally filter by tag or search).
   * @route GET /notes
   * @optional query params: tag, q
   */
  async getNotes(req, res) {
    try {
      const { tag, q } = req.query;
      const where = { userId: req.user.id };
      let noteQuery = {
        where,
        include: [{ model: Tag, as: 'tags', through: { attributes: [] } }]
      };

      if (tag) {
        noteQuery.include[0].where = { name: tag };
      }
      if (q) {
        noteQuery.where = {
          ...noteQuery.where,
          [require('sequelize').Op.or]: [
            { title: { [require('sequelize').Op.iLike]: `%${q}%` } },
            { content: { [require('sequelize').Op.iLike]: `%${q}%` } },
          ],
        };
      }
      const notes = await Note.findAll(noteQuery);
      res.json({ notes });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get notes.' });
    }
  }

  /**
   * Get a single note by id
   * @route GET /notes/:id
   */
  async getNoteById(req, res) {
    try {
      const note = await Note.findByPk(req.params.id, {
        include: [{ model: Tag, as: 'tags' }],
      });
      if (!note || note.userId !== req.user.id)
        return res.status(404).json({ error: 'Note not found.' });
      res.json({ note });
    } catch {
      res.status(500).json({ error: 'Failed to get note.' });
    }
  }

  /**
   * Update a note (only if owner)
   * @route PUT /notes/:id
   */
  async updateNote(req, res) {
    try {
      const note = await Note.findByPk(req.params.id, {
        include: [{ model: Tag, as: 'tags' }]
      });
      if (!note || note.userId !== req.user.id)
        return res.status(404).json({ error: 'Note not found.' });

      const { title, content, tags } = req.body;
      if (title !== undefined) note.title = title;
      if (content !== undefined) note.content = content;
      await note.save();

      if (tags) {
        await attachTagsToNote(note, tags);
      }
      const updated = await Note.findByPk(note.id, { include: [{ model: Tag, as: 'tags' }] });
      res.json({ note: updated });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update note.' });
    }
  }

  /**
   * Delete a note
   * @route DELETE /notes/:id
   */
  async deleteNote(req, res) {
    try {
      const note = await Note.findByPk(req.params.id);
      if (!note || note.userId !== req.user.id)
        return res.status(404).json({ error: 'Note not found.' });
      await note.destroy();
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Failed to delete note.' });
    }
  }
}

// Helper: Attach tags (by name array) to a note, creating missing tags if needed
async function attachTagsToNote(note, tagNames) {
  const tagObjs = [];
  for (const name of tagNames) {
    let tag = await Tag.findOne({ where: { name } });
    if (!tag) tag = await Tag.create({ name });
    tagObjs.push(tag);
  }
  await note.setTags(tagObjs);
}

module.exports = new NotesController();
