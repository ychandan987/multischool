// src/models/school.js

module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define(
    "School",
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
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "schools",
      timestamps: true, // createdAt + updatedAt (recommended)
    }
  );

  School.associate = (models) => {
    School.hasMany(models.User, {
      foreignKey: "schoolId",
      onDelete: "CASCADE",
      as: "users",
    });

    School.hasMany(models.Student, {
      foreignKey: "schoolId",
      onDelete: "CASCADE",
      as: "students",
    });
  };

  return School;
};
