import express from "express";
import {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
} from "../controller/TareaController.js";
import checkout from "../middleware/checkout.js";

const router = express.Router();

router.post("/", checkout, agregarTarea);
router
  .route("/:id")
  .get(checkout, obtenerTarea)
  .put(checkout, actualizarTarea)
  .delete(checkout, eliminarTarea);

router.post("/estado/:id", checkout, cambiarEstado);
export default router;
