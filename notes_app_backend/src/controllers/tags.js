const { Tag, Note, User } = require('../models');
const { Op } = require('sequelize');

// PUBLIC_INTERFACE
class TagsController {
  /**
   * Get all tags attached to user's notes, with note counts.
   * @route GET /tags
   */
  async getAll(req, res) {
    try {
      // Get all tags and number of notes they tag for this user
      const tags = await Tag.findAll({
        include: [
          {
            model: Note,
            as: 'notes',
            attributes: [],
            where: { userId: req.user.id },
            required: true,
          },
        ],
        group: ['Tag.id'],
        attributes: [
          'id',
          'name',
          [require('sequelize').fn('COUNT', require('sequelize').col('notes.id')), 'noteCount']
        ],
        order: [['name', 'ASC']]
      });
      res.json({ tags });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get tags.' });
    }
  }

  /**
   * Create a new tag manually (rarely needed).
   * @route POST /tags
   * @body { name }
   */
  async create(req, res) {
    try {
      const { name } = req.body;
      if (!name || typeof name !== 'string' || !name.trim())
        return res.status(400).json({ error: 'Tag name required.' });
      let tag = await Tag.findOne({ where: { name } });
      if (tag) return res.status(409).json({ error: 'Tag already exists.' });
      tag = await Tag.create({ name });
      res.status(201).json({ tag });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create tag.' });
    }
  }
}

module.exports = new TagsController();
