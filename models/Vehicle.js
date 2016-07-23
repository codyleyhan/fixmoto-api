module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define("Vehicle", {
    make: DataTypes.STRING,
    model: DataTypes.STRING,
    year: DataTypes.INTEGER,
    trim: DataTypes.STRING,
    color: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Vehicle.belongsTo(models.User, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });

        Vehicle.hasMany(models.Record);
        Vehicle.hasMany(models.Modification);
      }
    }
  });

  return Vehicle;
};
