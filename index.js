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

/*  const corsOptions = {
  origin: function (origin, callback) {
    if(whiteList.includes(origin)){
      callback(null, true)
    }else{
      callback(new Error("Cors error"))
    }
  },
}; */ 

app.use(express.json());
//TODO: Resolve cors bug
app.use(cors());
const PORT = process.env.PORT || 2500 || 1500;

//Routing
app.use("/api/usuarios", usuarioRouter);
app.use("/api/proyectos", proyectoRouter);
app.use("/api/tareas", tareaRouter);

const servidor = app.listen(PORT, () => {
  console.log("Listen in port: " + PORT);
});
