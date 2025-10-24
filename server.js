require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

console.log("[BOOT] Iniciando server.js");

const app = express();

// CORS abierto (en Render no uses origin fijo)
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logs globales de errores (para ver por qué se cae)
process.on('unhandledRejection', (r) => {
  console.error('[BOOT] unhandledRejection:', r);
});
process.on('uncaughtException', (e) => {
  console.error('[BOOT] uncaughtException:', e);
});

// (1) Prueba SIN DB primero: comenta temporalmente el bloque de Sequelize
let db;
try {
  console.log("[BOOT] Requiriendo modelos...");
  db = require("./app/models");
  console.log("[BOOT] Modelos requeridos OK");
} catch (e) {
  console.error("[BOOT] Error al requerir ./app/models:", e);
}

// *** COMENTAR TEMPORALMENTE ESTE BLOQUE PARA PROBAR SI ARRANCA SIN BD ***
// if (db?.sequelize) {
//   console.log("[BOOT] Autenticando BD...");
//   db.sequelize.authenticate()
//     .then(() => {
//       console.log("[BOOT] Conectado a la base de datos.");
//       return db.sequelize.sync();
//     })
//     .then(() => console.log("[BOOT] Modelos sincronizados."))
//     .catch((err) => console.error("[BOOT] Error de BD:", err));
// }

// Ruta simple
app.get("/", (req, res) => {
  res.json({ ok: true, message: "API Boletos", time: new Date().toISOString() });
});

// Rutas
try {
  require("./app/routes/usuario.routes.js")(app);
  require("./app/routes/partido.routes.js")(app);
  require("./app/routes/localidad.routes.js")(app);
  require("./app/routes/inventario.routes.js")(app);
  require("./app/routes/venta.routes.js")(app);
  console.log("[BOOT] Rutas registradas");
} catch (e) {
  console.error("[BOOT] Error registrando rutas:", e);
}

// Escuchar SIEMPRE el puerto de Render
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[BOOT] Server is running on port ${PORT}`);
});