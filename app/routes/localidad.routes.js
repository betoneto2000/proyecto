module.exports = app => {
  const localidades = require("../controllers/localidad.controller.js");
  const router = require("express").Router();

  router.post("/create/", localidades.create);
  router.get("/", localidades.findAll); // ?nombre=palco
  router.get("/:id", localidades.findOne);
  router.put("/update/:id", localidades.update);
  router.delete("/delete/:id", localidades.delete);
  router.delete("/delete/", localidades.deleteAll);

  app.use("/api/localidad", router);
};