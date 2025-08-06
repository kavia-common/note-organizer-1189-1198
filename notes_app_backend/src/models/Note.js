module.exports = (sequelize, DataTypes) => {
  /**
   * Note Model
   * Fields: id, userId, title, content, createdAt, updatedAt
   */
  const Note = sequelize.define(
    'Note',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to the user who owns the note',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
      tableName: 'notes',
    }
  );

  Note.associate = (models) => {
    Note.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Note.belongsToMany(models.Tag, {
      through: models.NoteTag,
      foreignKey: 'noteId',
      as: 'tags',
    });
  };

  return Note;
};
