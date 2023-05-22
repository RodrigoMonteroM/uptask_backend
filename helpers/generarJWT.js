import jwt from "jsonwebtoken";

const generarJWT = (id) => {
  const token = jwt.sign({id}, process.env.PRIVATE_KEY, {
    expiresIn: '30d'
  });
  return token;
};

export default generarJWT;
