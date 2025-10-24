module.exports = (sequelize, Sequelize) => {
  const Partido = sequelize.define("partido", {
    id_partido: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    equipo_visitante: { type: Sequelize.STRING(100), allowNull: false },
    equipo_local: { type: Sequelize.STRING(100), allowNull: false },
    fecha_partido: { type: Sequelize.DATE, allowNull: false },
    estadio: { type: Sequelize.STRING(100), allowNull: false },
    estado: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: { isIn: [['programado','activo','finalizado']] }
    }
  });
  return Partido;
};