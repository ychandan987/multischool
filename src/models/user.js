// src/models/user.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      canEditStudents: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // null for superadmin
      schoolId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: true, // recommended for auditing & login tracking
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
    });

    User.belongsTo(models.School, {
      foreignKey: "schoolId",
      as: "school",
      onDelete: "SET NULL", // superadmin stays NULL
    });
  };

  return User;
};
