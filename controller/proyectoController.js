//Proyectos
import Proyecto from "../Models/Proyecto.js";
import mongoose, { Error } from "mongoose";
import Usuario from "../Models/Usuario.js";

const obtenerProyectos = async (req, res) => {
  //PLURAL
  const { usuario } = req;

  console.log();

  try {
    const proyectos = await Proyecto.find({
      $or: [
        { colaboradores: { $in: req.usuario } },
        { creador: { $in: req.usuario } },
      ],
    }).select("-tareas");
    res.json(proyectos);
  } catch (error) {
    console.log(error);
    const err = new Error("Error Servidor");
    return res.status(500).json(err.message);
  }
};

const nuevoProyecto = async (req, res) => {
  //const { nombre, descripcion, cliente } = req.body;

  const proyecto = new Proyecto(req.body);

  // aqui asignas el creador del proyecto
  proyecto.creador = req.usuario._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
    const err = new Error("Error Servidor");
    return res.status(500).json(err.message);
  }
};

const obtenerProyecto = async (req, res) => {
  // SINGULAR

  const { id } = req.params;

  try {
    const proyect = await Proyecto.findById(id)
      .populate({path: "tareas", populate: {path: "completado", select: "nombre _id email"}})
      .populate("colaboradores", "nombre email");

    if (!proyect) {
      const error = new Error("No encontrado");
      return res.status(404).json(error.message);
    }

    if (
      proyect.creador.toString() !== req.usuario._id.toString() &&
      !proyect.colaboradores.some(
        (colaborador) =>
          colaborador._id.toString() === req.usuario._id.toString()
      )
    ) {
      const error = new Error("Accion no valida");
      return res.status(401).json(error.message);
    }
    res.json(proyect);
  } catch (error) {
    console.log(error);
    const err = new Error("Error Servidor");
    return res.status(500).json(err.message);
  }
};

const editarProyecto = async (req, res) => {
  const { id } = req.params;

  try {
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      const error = new Error("Proyecto no econtrado");
      return res.status(404).json(error.message);
    }

    /* proyecto.nombre = nombre || proyecto.nombre
    proyecto.descripcion = descripcion || proyecto.descripcion
    proyecto.cliente = cliente || proyecto.cliente
    proyecto.fechaEntrega = fechaEntrega || proyecto.fechaEntrega */

    await proyecto.updateOne(req.body);

    await proyecto.save();
    res.json(proyecto);
  } catch (e) {
    const err = new Error("Error Servidor");
    return res.status(500).json(err.message);
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;

  try {
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.status(404).json("Proyecto no encontrado");
    }
    await proyecto.deleteOne(proyecto);
    res.json("proyecto eliminado");
  } catch (error) {
    console.log(error);
    const err = new Error("Error Servidor");
    return res.status(500).json(err.message);
  }
};

//Colaborador

const buscarColaborador = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ email }).select(
      "-password -createdAt -confirmado -token -updatedAt -__v"
    );

    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ msj: error.message });
    }

    if (usuario._id.toString() === req.usuario._id.toString()) {
      const error = new Error("No te puedes agregar a ti mismo");
      return res.status(400).json({ msj: error.message });
    }
    res.status(200).json(usuario);
  } catch (err) {
    const error = new Error("Error de Servidor");
    return res.status(500).json({ msj: error.message });
  }
};

const agregarColaborador = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const proyecto = await Proyecto.findById(
      id
    ); /* .select("-password -createdAt -updatedAt -__0"); */
    const colaborador = await Usuario.findOne({ email });

    //console.log(proyecto)
    //console.log(req.usuario._id)

    if (!proyecto) {
      const error = new Error("Proyecto no encontrado");
      return res.status(404).json({ msj: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Accesso denegado");
      return res.status(404).json({ msj: error.message });
    }

    // si el colaboradoe ya se encuentra como colaborair
    if (proyecto.colaboradores.includes(colaborador._id)) {
      const error = new Error("Usuaio ya pertenece al proyecto");
      return res.status(400).json({ msj: error.message });
    }

    proyecto.colaboradores.push(colaborador._id);

    await proyecto.save();

    res.status(200).json({ msj: "colaborador agregado correctamente" });
  } catch (error) {
    console.log({ msj: error.message });
  }
};
const eliminarColaborador = async (req, res) => {
  const { id } = req.params;
  const { colaborador } = req.body;

  try {
    const proyecto = await Proyecto.findById(id).select(
      "-password -createdAt -tareas -__v"
    );

    if (!proyecto) {
      const error = new Error("Proyecto no existe");
      return res.status(400).json({ msj: error.message });
    }

    if (!proyecto.colaboradores.includes(colaborador._id)) {
      const error = new Error("usuario no pertenece en el proyecto");
      return res.status(400).json({ msj: error.message });
    }

    if (req.usuario._id.toString() !== proyecto.creador.toString()) {
      const error = new Error("Accion invalida");
      return res.status(400).json({ msj: error.message });
    }

    proyecto.colaboradores.pull(colaborador._id);
    await proyecto.save();
    //console.log(proyecto)
    res.json({ msj: "Colaborador eliminado correctamente" });
  } catch (err) {
    console.log(err.message);
  }
};

//tareas

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  buscarColaborador,
};
