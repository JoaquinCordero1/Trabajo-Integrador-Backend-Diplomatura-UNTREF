const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require("./src/mongoose.js");
const Computer = require("./src/product.js");

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json("¡Bienvenido al trabajo integrador!");
});

app.get("/productos", (req, res) => {
  res.json(Computer);
});

app.listen(port, () => {
  console.log(`Servidor alojado en http://localhost:${port}`);
});
