const express = require("express");
const app = express();
const port = process.env.PORT ?? 3000;
const connectDB = require("./database/database.js");
const Computer = require("./database/product.js");
connectDB(); //Conexión a MongoDB

process.loadEnvFile();
app.use(express.json());

app.get("/", (req, res) => {
  res.json("¡Bienvenidos a la API!");
});

// con /productos accedemos a toda la lista

app.get("/productos", (req, res) => {
  const { categoria } = req.query;

  // Filtrar las categorias discriminando las mayusculas y con coincidencias en la palabra
  const filter = !categoria
    ? {}
    : { categoria: { $regex: `^${categoria.slice(0, 3)}`, $options: "i" } }; // Buscamos las coincidencias con las tres primeras letras

  Computer.find(filter)
    .then((computacion) => {
      if (categoria && computacion.length === 0) {
        // Si no encuentra productos devuelve el error o si categoria está vacio devuelve todos los productos
        return res
          .status(404)
          .send("No se encontraron productos para la categoria especificada");
      }
      res.json(computacion);
    })
    .catch((error) => {
      console.log("Error al encontrar productos: ", error);
      res.status(500).send("Hubo un problema para encontrar los productos");
    });
});

app.get("/productos/:id", (req, res) => {
  const { id } = req.params;
  const query = { codigo: id };
  Computer.find(query)
    .then((productID) => {
      if (productID) {
        res.json(productID);
      } else {
        res
          .status(404)
          .send(
            `El producto con el id ${id} no pudo ser econtrado o no existe`
          );
      }
    })
    .catch((error) => {
      console.log("Error al obtener la pelicula", error);
      res.status(500).send(`Error al encontrar el producto`);
    });
});

app.use((req, res) => {
  res.status(404).send("Error 404. Página no encontrada");
});

app.listen(port, () => {
  console.log(`Servidor alojado en http://localhost:${port}`);
});
