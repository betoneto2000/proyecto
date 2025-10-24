// Importamos módulos
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3001"
};



//BASE http://localhost:3001/api/



app.use(cors(corsOptions));
app.use(bodyParser.json());

// BD (Sequelize)
const db = require("./app/models");

// Conexión y sincronización (tal como en tu chasis)
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado a la base de datos.");
    return db.sequelize.sync(); // crea tablas si no existen
  })
  .then(() => console.log("Modelos sincronizados."))
  .catch((err) => console.error("Error de BD:", err));

// Ruta simple
app.get("/", (req, res) => {
  res.json({ message: "Sistema de Venta de Boletos - API" });
});

// Rutas
require("./app/routes/usuario.routes.js")(app);
require("./app/routes/partido.routes.js")(app);
require("./app/routes/localidad.routes.js")(app);
require("./app/routes/inventario.routes.js")(app);
require("./app/routes/venta.routes.js")(app);

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});