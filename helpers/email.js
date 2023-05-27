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
    from: "rodrigo.test@yahoo.com",
    to: email,
    subject: "verifica il tuo account su Uptask",
    text: "verifica il tuo account su Uptask",
    html: `<p>Ciao ${nombre}, verifica il tuo account su Uptask</p>
    <p>Il tuo account è quasi pronto, devi solo confermarlo seguendo il link sottostante: <a href="${process.env.FRONTEND_URL}/conferma-account/${token}" >Conferma account</a></p>
    <p>Se non hai creato questo account, puoi ignorare questo messaggio.</p>`
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
