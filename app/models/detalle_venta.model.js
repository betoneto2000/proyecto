module.exports = (sequelize, Sequelize) => {
  const Detalle = sequelize.define("detalle_venta", {
    id_detalle: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_venta: { type: Sequelize.INTEGER, allowNull: false },
    id_localidad: { type: Sequelize.INTEGER, allowNull: false },
    id_partido: { type: Sequelize.INTEGER, allowNull: false },
    cantidad: { type: Sequelize.INTEGER, allowNull: false },
    precio_unitario: { type: Sequelize.DECIMAL(10,2), allowNull: false }
  });
  return Detalle;
};