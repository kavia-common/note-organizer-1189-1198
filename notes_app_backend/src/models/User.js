const bcrypt = require('bcrypt');

// PUBLIC_INTERFACE
module.exports = (sequelize, DataTypes) => {
  /**
   * User Model
   * Fields: id, name, email, passwordHash, createdAt
   */
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'The full name of the user',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        comment: 'Unique email address for username and login',
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Bcrypt hashed user password',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      tableName: 'users',
    }
  );

  // Hash password before creating the user
  User.beforeCreate(async (user, options) => {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Note, {
      foreignKey: 'userId',
      as: 'notes',
    });
  };

  // PUBLIC_INTERFACE
  User.prototype.validatePassword = function (password) {
    /** Compare plaintext to hash, for authentication. */
    return bcrypt.compare(password, this.passwordHash);
  };

  return User;
};
