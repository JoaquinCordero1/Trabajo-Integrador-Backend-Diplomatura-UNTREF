const express = require("express");
const app = express();
const port = process.env.PORT ?? 3000;
const connectDB = require("./database/database.js");
const Computer = require("./database/product.js");
connectDB(); //Conexión a MongoDB

process.loadEnvFile();
app.use(express.json());

app.get("/", (req, res) => {
  res.json("¡Bienvenidos al trabajo intregrador!");
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
    filter = !nombre ? {} : { nombre: { $regex: nombre, $options: "i" } };
  }
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
          .send("El producto no se encontró. Prueba buscando otro.");
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

//Agregar productos a la base de datos

app.post("/productos/create", (req, res) => {
  const { nombre } = req.body;
  Computer.findOne({ nombre: nombre }).then((nameProduct) => {
    if (nameProduct)
      return res.status(404).send("Este objeto ya está agregado");

    Computer.findOne()
      .sort({ codigo: -1 })
      .then((lastProduct) => {
        const addNewCode = lastProduct ? lastProduct.codigo + 1 : 1;
        const newProduct = new Computer({ codigo: addNewCode, ...req.body });
        newProduct
          .save()
          .then((saveNewProduct) => {
            res.status(201).json(saveNewProduct);
          })
          .catch((error) => {
            console.log("Hubo un error al agregar el producto", error);
            res.status(500).send("Error al agregar el producto");
          });
      });
  });
});

// Editar parcialmente un producto
app.patch("/productos/edit/:id", (req, res) => {
  const { id } = req.params;

  Computer.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatePrice) => {
      console.log("Precio actualizado con éxito");
      res.json(updatePrice);
    })
    .catch((error) => {
      console.log("Error al actualizar el precio", error);
      res.status(404).send("Hubo un problema en actualizar el precio");
    });
});

//Eliminar un producto de la base de datos

app.delete("/productos/:ID", (req, res) => {
  const { ID } = req.params;
  Computer.findByIdAndDelete(ID)
    .then((removeProduct) => {
      if (removeProduct) {
        console.log("Producto borrado");
        res.status(204).end();
      } else {
        console.log(
          "Error al borrar el producto. El producto no existe o ya fue eliminado anteriormente"
        );
        res.status(404).send("El producto que desea eliminar no se encuentra");
      }
    })
    .catch((error) => {
      console.error("Error al eliminar el producto", error);
      res.status(500).send("Error al eliminar el producto");
    });
});

//Error al acceder incorrectamente

app.use((req, res) => {
  res.status(404).send("Error 404. Página no encontrada");
});

app.listen(port, () => {
  console.log(`Servidor alojado en http://localhost:${port}`);
});
