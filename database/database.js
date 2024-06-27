const mongoose = require("mongoose");
process.loadEnvFile();

const URI = process.env.MONGODB_URI;

const connectDB = () => {
  return mongoose
    .connect(URI)
    .then(() => console.log("Conectado a MongoDB"))
    .catch((err) => console.log("Error al conectarse : ", err));
};

module.exports = connectDB;
