module.exports = app => {
  const inventario = require("../controllers/inventario.controller.js");
  const router = require("express").Router();

  router.post("/create/", inventario.create);
  router.get("/", inventario.findAll); // ?id_partido=
  router.get("/:id", inventario.findOne);
  router.put("/update/:id", inventario.update);
  router.delete("/delete/:id", inventario.delete);
  router.delete("/delete/", inventario.deleteAll);

  app.use("/api/inventario", router);
};