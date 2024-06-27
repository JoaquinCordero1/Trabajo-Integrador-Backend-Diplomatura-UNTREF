const mongoose = require("mongoose");
process.loadEnvFile();

const DATABASE_NAME = process.env.DATABASE_NAME;

const computerSchema = new mongoose.Schema(
  {
    codigo: Number,
    nombre: String,
    precio: Number,
    categoria: String,
  },
  { collection: DATABASE_NAME }
);

const Computer = mongoose.model("Computer", computerSchema);

module.exports = Computer;
