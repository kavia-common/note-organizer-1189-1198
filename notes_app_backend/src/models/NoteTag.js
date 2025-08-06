module.exports = (sequelize, DataTypes) => {
  /**
   * NoteTag Model - Association table for notes and tags many-to-many relationship
   */
  const NoteTag = sequelize.define(
    'NoteTag',
    {
      noteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'notes',
          key: 'id',
        },
      },
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'tags',
          key: 'id',
        },
      },
    },
    {
      timestamps: false,
      tableName: 'note_tags',
    }
  );

  return NoteTag;
};
