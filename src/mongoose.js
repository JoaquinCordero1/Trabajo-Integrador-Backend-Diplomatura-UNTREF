const mongoose = require("mongoose");
process.loadEnvFile();

const URI = process.env.MONGODB_URLSTRING;
const DATABASE_NAME = process.env.DATABASE_NAME;

const connectDB = async () => {
  try {
    await mongoose.connect(URI + DATABASE_NAME);
    return console.log("Conectando a MongoDB");
  } catch (error) {
    return console.log("Error al conectar a MongoDB:", error);
  }
};

module.exports = connectDB;
