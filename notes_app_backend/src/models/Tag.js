module.exports = (sequelize, DataTypes) => {
  /**
   * Tag Model
   * Fields: id, name
   */
  const Tag = sequelize.define(
    'Tag',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: false,
      tableName: 'tags',
    }
  );

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Note, {
      through: models.NoteTag,
      foreignKey: 'tagId',
      as: 'notes',
    });
  };

  return Tag;
};
