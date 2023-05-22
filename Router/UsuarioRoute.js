import express from "express";
import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil
} from "../controller/usuarioController.js";

import checkout from "../middleware/checkout.js";

const router = express.Router();

//Autenticacion, Registro y confirmacion de Usuario.

router.post("/", registrar);
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token", ).get(comprobarToken).post(nuevoPassword)
router.get("/perfil", checkout,  perfil);



export default router;
