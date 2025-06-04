module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gpay: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    upi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phonepe: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  return User;
};
