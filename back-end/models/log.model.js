module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define("Log", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    changeDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    signed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    termId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Terms",
        key: "id",
      },
    },
  });

  return Log;
};
