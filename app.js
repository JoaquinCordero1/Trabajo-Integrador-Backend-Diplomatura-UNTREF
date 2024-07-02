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
  const { categoria, nombre } = req.query;

  let filter = {};

  if (categoria) {
    filter = !categoria
      ? {}
      : {
          categoria: { $regex: `^${categoria.slice(0, 3)}`, $options: "i" },
        };
  }
  if (nombre) {
    filter = !nombre
      ? {}
      : { nombre: { $regex: `^${nombre.slice(0, 3)}`, $options: "i" } };
  }

  // Filtrar las categorias discriminando las mayusculas y con coincidencias en la palabra
  // const filtro = !categoria
  //   ? {}
  //   : { categoria: { $regex: `^${categoria.slice(0, 3)}`, $options: "i" } }; // Buscamos las coincidencias con las tres primeras letras

  Computer.find(filter)
    .then((computacion) => {
      if ((categoria || nombre) && computacion.length === 0) {
        // Si no encuentra productos devuelve el error o si su categoria está vacia devuelve todos los productos
        return res
          .status(404)
          .send(`La busqueda de: ${nombre || categoria} no se encontró`);
      }
      res.json(computacion);
    })
    .catch((error) => {
      console.log("Error al encontrar productos: ", error);
      res.status(500).send("Hubo un problema para encontrar los productos.");
    });
});

// Filtrar producto por su id (codigo)
app.get("/productos/:id", (req, res) => {
  const { id } = req.params;
  const findCode = { codigo: id };

  Computer.find(findCode)
    .then((productID) => {
      if (findCode && productID.length === 0) {
        console.log(
          "Aún no hay productos con ese código, prueba utilizando otro"
        );
        res
          .status(404)
          .send("El producto no se encontró. Prueba buscando otro. ");
      } else {
        console.log("Búsqueda exitosa");
        res.json(productID);
      }
    })
    .catch((error) => {
      console.log("Error al obtener el producto: ", error);
      res.status(500).send("Error al encontrar el producto.");
    });
});

app.use((req, res) => {
  res.status(404).send("Error 404. Página no encontrada");
});

app.listen(port, () => {
  console.log(`Servidor alojado en http://localhost:${port}`);
});
