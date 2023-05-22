import mongoose from "mongoose";
import bcrypt, { genSalt } from "bcrypt";

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    token: {
      type: String,
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UsuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next(); // si password no ha sido hasheado
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//verificar si la passoword es correcta;
UsuarioSchema.methods.comprobarPassword = async function(passoword){

  return await bcrypt.compare(passoword, this.password);

}

const Usuario = mongoose.model("Usuario", UsuarioSchema);

export default Usuario;
