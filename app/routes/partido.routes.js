module.exports = app => {
  const partidos = require("../controllers/partido.controller.js");
  const router = require("express").Router();

  router.post("/create/", partidos.create);
  router.get("/", partidos.findAll); // ?estado=activo
  router.get("/:id", partidos.findOne);
  router.put("/update/:id", partidos.update);
  router.delete("/delete/:id", partidos.delete);
  router.delete("/delete/", partidos.deleteAll);

  app.use("/api/partido", router);
};