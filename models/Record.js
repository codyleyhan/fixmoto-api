module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define("Record", {
    mileage: DataTypes.INTEGER,
    mechanic: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    classMethods: {
      associate: (models) => {
        Record.belongsTo(models.Vehicle, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });

        Record.hasMany(models.Maintenance);
      }
    }
  });

  return Record;
};
