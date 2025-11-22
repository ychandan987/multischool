// src/models/student.js

module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      rollNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      schoolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "students",
      timestamps: true, // recommended for auditing
    }
  );

  Student.associate = (models) => {
    Student.belongsTo(models.School, {
      foreignKey: "schoolId",
      as: "school",
      onDelete: "CASCADE",
    });
  };

  return Student;
};
