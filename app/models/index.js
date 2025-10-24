const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: dbConfig.pool
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos
db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);
db.partidos = require("./partido.model.js")(sequelize, Sequelize);
db.localidades = require("./localidad.model.js")(sequelize, Sequelize);
db.inventario_boletos = require("./inventario_boletos.model.js")(sequelize, Sequelize);
db.ventas = require("./venta.model.js")(sequelize, Sequelize);
db.detalle_ventas = require("./detalle_venta.model.js")(sequelize, Sequelize);

// Relaciones
// Usuario -> Ventas
db.usuarios.hasMany(db.ventas, { foreignKey: "id_vendedor" });
db.ventas.belongsTo(db.usuarios, { foreignKey: "id_vendedor" });

// Partido -> Inventario, Detalles
db.partidos.hasMany(db.inventario_boletos, { foreignKey: "id_partido" });
db.inventario_boletos.belongsTo(db.partidos, { foreignKey: "id_partido" });

db.partidos.hasMany(db.detalle_ventas, { foreignKey: "id_partido" });
db.detalle_ventas.belongsTo(db.partidos, { foreignKey: "id_partido" });

// Localidad -> Inventario, Detalles
db.localidades.hasMany(db.inventario_boletos, { foreignKey: "id_localidad" });
db.inventario_boletos.belongsTo(db.localidades, { foreignKey: "id_localidad" });

db.localidades.hasMany(db.detalle_ventas, { foreignKey: "id_localidad" });
db.detalle_ventas.belongsTo(db.localidades, { foreignKey: "id_localidad" });

// Venta -> DetalleVenta
db.ventas.hasMany(db.detalle_ventas, { foreignKey: "id_venta" });
db.detalle_ventas.belongsTo(db.ventas, { foreignKey: "id_venta" });

module.exports = db;