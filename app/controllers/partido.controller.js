const db = require("../models");
const Partido = db.partidos;
const Op = db.Sequelize.Op;

// Create
exports.create = (req, res) => {
  const { equipo_visitante, equipo_local, fecha_partido, estadio, estado } = req.body;
  if (!equipo_visitante || !equipo_local || !fecha_partido || !estadio || !estado) {
    return res.status(400).send({ message: "Todos los campos son obligatorios." });
  }
  Partido.create({ equipo_visitante, equipo_local, fecha_partido, estadio, estado })
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error al crear el partido." }));
};

// Read all (filtro por estado)
exports.findAll = (req, res) => {
  const { estado } = req.query;
  const condition = estado ? { estado: { [Op.eq]: estado } } : null;
  Partido.findAll({ where: condition })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error al obtener los partidos." }));
};

// Read one
exports.findOne = (req, res) => {
  const id = req.params.id;
  Partido.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: `Partido no encontrado con id=${id}` }))
    .catch(err => res.status(500).send({ message: "Error al obtener el partido con id=" + id }));
};

// Update
exports.update = (req, res) => {
  const id = req.params.id;
  Partido.update(req.body, { where: { id_partido: id } })
    .then(([num]) => num === 1
      ? res.send({ message: "Partido actualizado correctamente." })
      : res.send({ message: `No se pudo actualizar el partido con id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error al actualizar el partido con id=" + id }));
};

// Delete
exports.delete = (req, res) => {
  const id = req.params.id;
  Partido.destroy({ where: { id_partido: id } })
    .then(num => num === 1
      ? res.send({ message: "Partido eliminado correctamente." })
      : res.send({ message: `No se pudo eliminar el partido con id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error al eliminar el partido con id=" + id }));
};

// Delete all
exports.deleteAll = (req, res) => {
  Partido.destroy({ where: {}, truncate: false })
    .then(nums => res.send({ message: `${nums} partidos eliminados correctamente.` }))
    .catch(err => res.status(500).send({ message: err.message || "Error al eliminar todos los partidos." }));
};