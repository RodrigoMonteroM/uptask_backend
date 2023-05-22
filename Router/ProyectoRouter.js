import express from "express";
import {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  buscarColaborador
} from "../controller/proyectoController.js";

import checkout from "../middleware/checkout.js";

const router = express.Router();

router.route("/")
  .get(checkout, obtenerProyectos)
  .post(checkout, nuevoProyecto);
router
  .route("/:id")
  .get(checkout, obtenerProyecto)
  .put(checkout, editarProyecto)
  .delete(checkout, eliminarProyecto);


router.get("/tareas/:id", checkout, obtenerProyecto)  
router.post("/colaboradores", checkout, buscarColaborador);
router.post("/colaboradores/:id", checkout, agregarColaborador);
router.post("/eliminar-colaboradores/:id", checkout, eliminarColaborador);



//router.get("/hola/como", (req, res) => res.json("hola"))



export default router;
