module.exports = function(sequelize, DataTypes) {
  var Character = sequelize.define("Character", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });

  Character.associate = function(models) {
    Character.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      },
      onDelete: "CASCADE"
    });
  };
  return Character;
};
