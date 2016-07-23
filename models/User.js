module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    hash: DataTypes.STRING,
    verifyToken: {
      type: DataTypes.UUID,
      unique: true,
    },
    resetToken: {
      type: DataTypes.UUID,
      unique: true,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Vehicle);
      }
    }
  });

  return User;
};
