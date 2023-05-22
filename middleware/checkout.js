import jwt from "jsonwebtoken";
import Usuario from "../Models/Usuario.js";
const checkout = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

      req.usuario = await Usuario.findById(decoded.id).select(
        "-password -confirmado -token -createdAt -updatedAt, -__v"
      ); // crea un usuario que se podra acceder dentro de la app

      return next();
    } catch (err) {
      return res.status(404).json({ msj: "Hubo un error en auth" });
    }
  }

  if (!token) {
    const error = new Error("Token no valido");
    return res.status(404).json(error.message);
  }

  next();
};

export default checkout;
