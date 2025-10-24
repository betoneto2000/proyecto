module.exports = (sequelize, Sequelize) => {
  const Usuario = sequelize.define("usuario", {
    id_usuario: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_usuario: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    contrasena_hash: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    nombre_completo: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    rol: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: { isIn: [['administrador','vendedor']] }
    },
    fecha_creacion: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
  return Usuario;
};