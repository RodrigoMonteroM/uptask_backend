import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import usuarioRouter from "./Router/UsuarioRoute.js";
import proyectoRouter from "./Router/ProyectoRouter.js";
import tareaRouter from "./Router/TareaRoutes.js";
import cors from "cors";

const app = express();
dotenv.config(); // get variables envirioment
connectDB();

const whiteList = [process.env.FRONTEND_URL];

app.use(express.json());

const PORT = process.env.PORT || 2500 || 1500;

//Routing
app.use(cors(whiteList));
app.use("/api/usuarios", usuarioRouter);
app.use("/api/proyectos", proyectoRouter);
app.use("/api/tareas", tareaRouter);

const servidor = app.listen(PORT, () => {
  console.log("Listen in port: " + PORT);
});

//socket io

import { Server } from "socket.io";

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  //define los eventos de socket io

  socket.on("prueba", (nombre) => {
    console.log("prueba desde socket io " , nombre);
  });

  socket.emit("respuesta")
});
