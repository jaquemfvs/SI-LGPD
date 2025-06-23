module.exports = (sequelize, DataTypes) => {
  const Term = sequelize.define("Term", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    versionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Versions",
        key: "id",
      },
    },
    optional: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  return Term;
};
