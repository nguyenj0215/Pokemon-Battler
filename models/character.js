module.exports = function(sequelize, DataTypes) {
  var Character = sequelize.define("Character", {
    class: DataTypes.STRING,
    name: DataTypes.STRING
  });
  return Character;
};
