const db = require("../models");
const sequelize = db.sequelize;
const Venta = db.ventas;
const Detalle = db.detalle_ventas;
const Inventario = db.inventario_boletos;
const Localidad = db.localidades;

// Crear Venta con detalles y actualizar inventario
// Body esperado:
// { id_vendedor, detalles: [ { id_partido, id_localidad, cantidad } ] }
exports.create = async (req, res) => {
  const { id_vendedor, detalles } = req.body;
  if (!id_vendedor || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).send({ message: "id_vendedor y al menos un detalle son obligatorios." });
  }

  const t = await sequelize.transaction();
  try {
    // Creamos la venta (total temporal 0)
    const venta = await Venta.create({ id_vendedor, total_venta: 0 }, { transaction: t });
    let total = 0;

    for (const d of detalles) {
      const { id_partido, id_localidad, cantidad } = d;
      if (!id_partido || !id_localidad || !cantidad) {
        throw new Error("Cada detalle debe tener id_partido, id_localidad y cantidad.");
      }

      // Precio actual de la localidad
      const loc = await Localidad.findByPk(id_localidad, { transaction: t });
      if (!loc) throw new Error(`Localidad no encontrada: ${id_localidad}`);

      // Verificar inventario
      const inv = await Inventario.findOne({ where: { id_partido, id_localidad } , transaction: t });
      if (!inv) throw new Error(`Inventario no encontrado para partido=${id_partido}, localidad=${id_localidad}`);
      if (inv.cantidad_disponible < cantidad) {
        throw new Error(`No hay suficientes boletos disponibles (disp=${inv.cantidad_disponible}, solicitado=${cantidad}).`);
      }

      // Crear detalle
      const precio_unitario = loc.precio;
      await Detalle.create({
        id_venta: venta.id_venta,
        id_localidad,
        id_partido,
        cantidad,
        precio_unitario
      }, { transaction: t });

      // Actualizar inventario
      inv.cantidad_disponible = inv.cantidad_disponible - cantidad;
      await inv.save({ transaction: t });

      total += Number(precio_unitario) * Number(cantidad);
    }

    // Actualizar total de la venta
    venta.total_venta = total;
    await venta.save({ transaction: t });

    await t.commit();
    res.status(201).send(venta);
  } catch (err) {
    await t.rollback();
    res.status(500).send({ message: err.message || "Error al crear la venta." });
  }
};

// Listar ventas (opcional filtro por id_vendedor)
exports.findAll = (req, res) => {
  const { id_vendedor } = req.query;
  const where = id_vendedor ? { id_vendedor } : null;
  Venta.findAll({ where })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error al obtener las ventas." }));
};

// Obtener venta con sus detalles
exports.findOne = (req, res) => {
  const id = req.params.id;
  Venta.findByPk(id, { include: [{ model: db.detalle_ventas }] })
    .then(data => data ? res.send(data) : res.status(404).send({ message: `Venta no encontrada con id=${id}` }))
    .catch(err => res.status(500).send({ message: "Error al obtener la venta con id=" + id }));
};

// Eliminar venta (restaura inventario)
exports.delete = async (req, res) => {
  const id = req.params.id;
  const t = await sequelize.transaction();
  try {
    const detalles = await Detalle.findAll({ where: { id_venta: id }, transaction: t });
    for (const d of detalles) {
      const inv = await Inventario.findOne({ where: { id_partido: d.id_partido, id_localidad: d.id_localidad }, transaction: t });
      if (inv) {
        inv.cantidad_disponible = inv.cantidad_disponible + d.cantidad;
        await inv.save({ transaction: t });
      }
    }
    await Detalle.destroy({ where: { id_venta: id }, transaction: t });
    const num = await Venta.destroy({ where: { id_venta: id }, transaction: t });
    await t.commit();
    if (num === 1) return res.send({ message: "Venta eliminada correctamente." });
    res.send({ message: `No se pudo eliminar la venta con id=${id}.` });
  } catch (err) {
    await t.rollback();
    res.status(500).send({ message: err.message || "Error al eliminar la venta." });
  }
};

// Eliminar todas las ventas
exports.deleteAll = (req, res) => {
  Venta.destroy({ where: {}, truncate: false })
    .then(nums => res.send({ message: `${nums} ventas eliminadas correctamente.` }))
    .catch(err => res.status(500).send({ message: err.message || "Error al eliminar todas las ventas." }));
};

// Listar detalles por venta
exports.findDetallesByVenta = (req, res) => {
  const id = req.params.id;
  Detalle.findAll({ where: { id_venta: id } })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error al obtener los detalles." }));
};