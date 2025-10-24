const db = require("../models");
const Localidad = db.localidades;
const Op = db.Sequelize.Op;

// Create
exports.create = (req, res) => {
  const { nombre, precio } = req.body;
  if (!nombre || precio == null) {
    return res.status(400).send({ message: "Todos los campos son obligatorios." });
  }
  Localidad.create({ nombre, precio })
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error al crear la localidad." }));
};

// Read all (filtro por nombre)
exports.findAll = (req, res) => {
  const { nombre } = req.query;
  const condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;
  Localidad.findAll({ where: condition })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error al obtener las localidades." }));
};

// Read one
exports.findOne = (req, res) => {
  const id = req.params.id;
  Localidad.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: `Localidad no encontrada con id=${id}` }))
    .catch(err => res.status(500).send({ message: "Error al obtener la localidad con id=" + id }));
};

// Update
exports.update = (req, res) => {
  const id = req.params.id;
  Localidad.update(req.body, { where: { id_localidad: id } })
    .then(([num]) => num === 1
      ? res.send({ message: "Localidad actualizada correctamente." })
      : res.send({ message: `No se pudo actualizar la localidad con id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error al actualizar la localidad con id=" + id }));
};

// Delete
exports.delete = (req, res) => {
  const id = req.params.id;
  Localidad.destroy({ where: { id_localidad: id } })
    .then(num => num === 1
      ? res.send({ message: "Localidad eliminada correctamente." })
      : res.send({ message: `No se pudo eliminar la localidad con id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error al eliminar la localidad con id=" + id }));
};

// Delete all
exports.deleteAll = (req, res) => {
  Localidad.destroy({ where: {}, truncate: false })
    .then(nums => res.send({ message: `${nums} localidades eliminadas correctamente.` }))
    .catch(err => res.status(500).send({ message: err.message || "Error al eliminar todas las localidades." }));
};