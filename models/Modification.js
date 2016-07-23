module.exports = (sequelize, DataTypes) => {
  const Modification = sequelize.define("Modification", {
    description: DataTypes.STRING,
    product: DataTypes.STRING,
    date: DataTypes.DATE,
    mechanic: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Modification.belongsTo(models.Vehicle, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Modification;
};
