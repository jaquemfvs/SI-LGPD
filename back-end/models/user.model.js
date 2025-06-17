module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    agreedToPromotionalEmails: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    subscribedToNewsletter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    privacyPolicyLastUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    termsOfUseLastUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    promotionalEmailsLastUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    privacyPolicyVersionAccepted: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    termsOfUseVersionAccepted: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return User;
};
