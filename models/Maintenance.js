module.exports = (sequelize, DataTypes) => {
  const Maintenance = sequelize.define("Maintenance", {
    work: DataTypes.STRING,
    product: DataTypes.STRING,
    amount: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Maintenance.belongsTo(models.Record, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Maintenance;
};
