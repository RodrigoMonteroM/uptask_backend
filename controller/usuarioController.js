import Usuario from "../Models/Usuario.js";
import bcrypt from "bcrypt";
import { generarId } from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassoword } from "../helpers/email.js";

const registrar = async (req, res) => {
  //evitar registro duplicado
  const { email } = req.body;

  const ExisteUsuario = await Usuario.findOne({ email });
  
  if (ExisteUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msj: error.message });
  }
  // en caso que el email no existe
  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId(); // generar id
    await usuario.save();

    //envio de email;

     emailRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });

    res.json({
      msj: "Usuario creado correctamente, Revisa tu email para confirmar la cuenta",
    });
  } catch (err) {
    console.log(err);
  }
};

const autenticar = async (req, res) => {
  //comprobar si el usuario existe
  const { email, password } = req.body;

  //console.log(req.body);
  const usuario = await Usuario.findOne({ email });

 

  if (!usuario) {
    //console.log("autiranzdo si el usuario existe")
    const error = new Error("Usuario no encontrado");
    return res.status(404).json(error.message);
  }
  // comprobar si el usuario esta confirmado

  if (!usuario.confirmado) {
    const error = new Error("Cuenta no confirmado");
    return res.status(403).json(error.message);
  }
  //comprobar su password

  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    }); // retornamos al frontend los datos necesarios
  } else {
    //console.log(await usuario.comprobarPassword(password));
    const error = new Error("Usuario no encontrado o password incorreacta");
    return res.status(404).json(error.message);
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params; // conseguimos el parametro: {{API_URL}}usuarios/confirmar/12

  const usuario = await Usuario.findOne({ token });

  if (!usuario) {
    const error = new Error("Token no valido");
    return res.status(403).json(error.message);
  }

  try {
    usuario.confirmado = true;
    usuario.token = "";

    await usuario.save();
    res.json({ msj: "Usuario Confirmado correctamente" });
  } catch (err) {
    console.log(err);
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  //verificar si el usuario existe
  console.log("hey");
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json(error.message);
  }

  try {
    usuario.token = generarId();
    await usuario.save();
    emailOlvidePassoword({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });
    res.json({ msj: "Hemos enviado un email con los pasos" });
  } catch (err) {
    console.log(err);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Usuario.findOne({ token });

  // verificar si el usuario existe
  if (!tokenValido) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json(error.message);
  }

  res.json({ msj: "Link valido, puedes cambiar tu password" });
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });

  // verificar si el usuario existe

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json(error.message);
  }

  usuario.password = password;
  usuario.token = "";

  await usuario.save();

  res.json({ msj: "Password modificado correactamente" });
};

const perfil = async (req, res) => {
  const { usuario } = req;
  res.json(usuario);
}

export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
};
