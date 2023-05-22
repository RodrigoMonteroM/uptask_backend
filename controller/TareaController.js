import Proyecto from "../Models/Proyecto.js";
import Tarea from "../Models/Tarea.js";

const agregarTarea = async (req, res) => {
  try {
    const { proyecto } = req.body;

    const proyectoExiste = await Proyecto.findById(proyecto);

    if (!proyectoExiste) {
      const error = new Error("El Proyecto no existe");
      return res.status(404).json({ msj: error.message });
    }

    if (proyectoExiste.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("No tines los permisos para anadir tareas");
      return res.status(404).json({ msj: error.message });
    }

    const tareaAlmacendada = await Tarea.create(req.body);
    proyectoExiste.tareas.push(tareaAlmacendada._id);
    await proyectoExiste.save();
    res.json(tareaAlmacendada);
  } catch (err) {
    console.log(err);
  }
};
const obtenerTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encntrada");
    return res.status(403).json({ msj: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no permitida");
    return res.status(404).json({ msj: error.message });
  }

  res.json(tarea);
};

const actualizarTarea = async (req, res) => {
  try {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
      const error = new Error("Tarea no encntrada");
      return res.status(403).json({ msj: error.message });
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Accion no permitida");
      return res.status(404).json({ msj: error.message });
    }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    const tareaAlmacenada = await tarea.save();
    res.json(tareaAlmacenada);
  } catch (err) {
    console.log(tareaAlmacenada);
  }
};
const eliminarTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encntrada");
    return res.status(403).json({ msj: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no permitida");
    return res.status(404).json({ msj: error.message });
  }

  try {
    const proyecto = await Proyecto.findById(tarea.proyecto);
    proyecto.tareas.pull(tarea.proyecto);

    Promise.allSettled([await proyecto.save(), await Tarea.deleteOne(tarea)]);
    res.json("tarea eliminada");
  } catch (err) {
    console.log(err);
  }
};
const cambiarEstado = async (req, res) => {
  const { id } = req.params;
  try {
    const tarea = await Tarea.findById(id)
      .populate("proyecto")
      .populate("completado");
    console.log(tarea);
    if (!tarea) {
      const error = new Error("Tarea no encntrada");
      return res.status(403).json({ msj: error.message });
    }

    if (
      req.usuario._id.toString() !== tarea.proyecto.creador.toString() &&
      !tarea.proyecto.colaboradores.some((colaborador) => {
        colaborador._id.toString() === req.body._id.toString();
      })
    ) {
      const error = new Error("Accion denegada");
      return res.status(403).json({ msj: error.message });
    }

    tarea.estado = !tarea.estado;
    tarea.completado = req.usuario._id;
    await tarea.save();

    const tareaAlmacenada = await Tarea.findById(id)
      .populate("proyecto")
      .populate("completado");

    res.json(tareaAlmacenada);
  } catch (err) {
    console.log(err.message);
  }
};

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};
