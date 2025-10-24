module.exports = (sequelize, Sequelize) => {
  const Venta = sequelize.define("venta", {
    id_venta: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_vendedor: { type: Sequelize.INTEGER, allowNull: false },
    fecha_venta: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    total_venta: { type: Sequelize.DECIMAL(10,2), allowNull: false }
  });
  return Venta;
};