module.exports = app => {
  const ventas = require("../controllers/venta.controller.js");
  const router = require("express").Router();

  router.post("/create/", ventas.create); // crea venta con detalles
  router.get("/", ventas.findAll);
  router.get("/:id", ventas.findOne);
  router.get("/:id/detalle", ventas.findDetallesByVenta);
  router.delete("/delete/:id", ventas.delete);
  router.delete("/delete/", ventas.deleteAll);

  app.use("/api/venta", router);
};