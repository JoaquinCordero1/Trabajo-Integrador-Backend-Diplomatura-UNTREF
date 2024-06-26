const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const computerSchema = new mongoose.Schema({
  codigo: Number,
  nombre: String,
  precio: Number,
  categoria: String,
});

const Computer = mongoose.model("Computer", computerSchema);

module.exports = Computer;
