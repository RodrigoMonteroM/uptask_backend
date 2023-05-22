import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // envio del email

  let info = await transport.sendMail({
    from: '"UpTask Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "Uptask confirma tu cuenta",
    text: "Comprueba tu cuenta en uptask",
    html: `<p>Hola ${nombre} comprueba tu cuenta en Uptask</p>
    <p>Tu cuenta ya esta casi lista, soldo debes comprobar en el siguiente enlace: <a href="${process.env.FRONTEND_URL}/confimar-cuenta/${token}" >Comprobar cuenta</a>
    <p>Si no creaste esa cuenta puedes ignorarlo </p>
    `,                                                                                                                  
  });

  console.log("Message sent: %s", info.messageId);
};

export const emailOlvidePassoword = async (datos) => {
  const { email, nombre, token } = datos;

  // TODO: save in variable envarioment 
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // envio del email

  let info = await transport.sendMail({
    from: '"UpTask Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "Uptask - Restablece tu password",
    text: "Restablece tu password en Uptask",
    html: `<p>Hola ${nombre} recupera tu contraseña</p>
    <p>Has click en el siguiete enlace para crear una nueva contraseña <a href="${process.env.FRONTEND_URL}/olvide-password/${token}" >Restablecer Password</a>
    <p>Si no solicitaste este email, puedes ignorarlo </p>
    `,
  });

  console.log("Message sent: %s", info.messageId);
};
