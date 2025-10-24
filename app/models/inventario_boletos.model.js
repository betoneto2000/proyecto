module.exports = (sequelize, Sequelize) => {
  const Inventario = sequelize.define("inventario_boletos", {
    id_inventario: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_partido: { type: Sequelize.INTEGER, allowNull: false },
    id_localidad: { type: Sequelize.INTEGER, allowNull: false },
    cantidad_total: { type: Sequelize.INTEGER, allowNull: false },
    cantidad_disponible: { type: Sequelize.INTEGER, allowNull: false }
  }, {
    indexes: [
      { unique: true, fields: ["id_partido","id_localidad"] }
    ]
  });
  return Inventario;
};