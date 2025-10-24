const db = require("../models");
const Inventario = db.inventario_boletos;
const Op = db.Sequelize.Op;

// Create
exports.create = (req, res) => {
  const { id_partido, id_localidad, cantidad_total, cantidad_disponible } = req.body;
  if (!id_partido || !id_localidad || cantidad_total == null || cantidad_disponible == null) {
    return res.status(400).send({ message: "Todos los campos son obligatorios." });
  }
  Inventario.create({ id_partido, id_localidad, cantidad_total, cantidad_disponible })
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error al crear el inventario." }));
};

// Read all (filtros: ?id_partido=)
exports.findAll = (req, res) => {
  const { id_partido } = req.query;
  const condition = id_partido ? { id_partido: { [Op.eq]: id_partido } } : null;
  Inventario.findAll({ where: condition })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error al obtener el inventario." }));
};

// Read one
exports.findOne = (req, res) => {
  const id = req.params.id;
  Inventario.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: `Inventario no encontrado con id=${id}` }))
    .catch(err => res.status(500).send({ message: "Error al obtener el inventario con id=" + id }));
};

// Update
exports.update = (req, res) => {
  const id = req.params.id;
  Inventario.update(req.body, { where: { id_inventario: id } })
    .then(([num]) => num === 1
      ? res.send({ message: "Inventario actualizado correctamente." })
      : res.send({ message: `No se pudo actualizar el inventario con id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error al actualizar el inventario con id=" + id }));
};

// Delete
exports.delete = (req, res) => {
  const id = req.params.id;
  Inventario.destroy({ where: { id_inventario: id } })
    .then(num => num === 1
      ? res.send({ message: "Inventario eliminado correctamente." })
      : res.send({ message: `No se pudo eliminar el inventario con id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error al eliminar el inventario con id=" + id }));
};

// Delete all
exports.deleteAll = (req, res) => {
  Inventario.destroy({ where: {}, truncate: false })
    .then(nums => res.send({ message: `${nums} registros de inventario eliminados correctamente.` }))
    .catch(err => res.status(500).send({ message: err.message || "Error al eliminar todo el inventario." }));
};