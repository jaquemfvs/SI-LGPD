module.exports = (sequelize, DataTypes) => {
  const Version = sequelize.define("Version", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Version;
};
