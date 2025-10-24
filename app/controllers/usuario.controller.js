const db = require("../models");
const Usuario = db.usuarios;
const Op = db.Sequelize.Op;

// Create
exports.create = (req, res) => {
  const { nombre_usuario, contrasena_hash, nombre_completo, rol } = req.body;
  if (!nombre_usuario || !contrasena_hash || !nombre_completo || !rol) {
    return res.status(400).send({ message: "Todos los campos son obligatorios." });
  }
  Usuario.create({ nombre_usuario, contrasena_hash, nombre_completo, rol })
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error al crear el usuario." }));
};

// Read all (filtro por nombre_usuario)
exports.findAll = (req, res) => {
  const { nombre_usuario } = req.query;
  const condition = nombre_usuario ? { nombre_usuario: { [Op.iLike]: `%${nombre_usuario}%` } } : null;
  Usuario.findAll({ where: condition })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error al obtener los usuarios." }));
};

// Read one
exports.findOne = (req, res) => {
  const id = req.params.id;
  Usuario.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: `Usuario no encontrado con id=${id}` }))
    .catch(err => res.status(500).send({ message: "Error al obtener el usuario con id=" + id }));
};

// Update
exports.update = (req, res) => {
  const id = req.params.id;
  Usuario.update(req.body, { where: { id_usuario: id } })
    .then(([num]) => num === 1
      ? res.send({ message: "Usuario actualizado correctamente." })
      : res.send({ message: `No se pudo actualizar el usuario con id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error al actualizar el usuario con id=" + id }));
};

// Delete
exports.delete = (req, res) => {
  const id = req.params.id;
  Usuario.destroy({ where: { id_usuario: id } })
    .then(num => num === 1
      ? res.send({ message: "Usuario eliminado correctamente." })
      : res.send({ message: `No se pudo eliminar el usuario con id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error al eliminar el usuario con id=" + id }));
};

// Delete all
exports.deleteAll = (req, res) => {
  Usuario.destroy({ where: {}, truncate: false })
    .then(nums => res.send({ message: `${nums} usuarios eliminados correctamente.` }))
    .catch(err => res.status(500).send({ message: err.message || "Error al eliminar todos los usuarios." }));
};