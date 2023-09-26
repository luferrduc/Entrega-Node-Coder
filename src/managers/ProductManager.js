import fs from "node:fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // GET ALL
  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const products = JSON.parse(data);
        return products;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      return { error };
    }
  };

  // GET BY ID
  getProductById = async (id) => {
    try {
      const products = await this.getProducts();
      const productFound = products.find((product) => {
        return product.id == id;
      });
      if (!productFound) return { error: "Error: 404 Not Found" };

      return productFound;
    } catch (error) {
      console.log(error);
      return { error };
    }
  };

  // ADD
  addProduct = async (producto) => {
    const { title, description, price, thumbnail, code, stock } = producto;
    const error = {};
    // Validacion de campos
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log(
        "Error: El producto no fue ingresado, todos los campos son obligatorios"
      );
      return {
        error:
          "Error: El producto no fue ingresado, todos los campos son obligatorios",
      };
    }

    try {
      const products = await this.getProducts();

      if (!products.length) {
        // CODE único
        const productCode = products.find((product) => product.code === code);
        if (productCode) {
          error.error = `Error: El código ${code} del producto ingresado ya se encuentra en otro producto.`;
          console.log(
            `Error: El código ${code} del producto ingresado ya se encuentra en otro producto.`
          );
          return { error };
        }
        producto.id = 1;
      } else {
        producto.id = products[products.length - 1].id + 1;
      }

      products.push(producto);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      console.log("Producto agregado correctamente");
      return producto;
    } catch (error) {
      console.log(error);
      return { error };
    }
  };

  // UPDATE
  updateProduct = async (id, producto) => {
    const { title, description, price, thumbnail, code, stock } = producto;
    // Validacion de campos

    if (!producto) {
      console.log("Error: No se puede actualizar con un producto vacío");
      return;
    }

    try {
      const products = await this.getProducts();
      const productFound = await this.getProductById(id);
      if (productFound.error) {
        return productFound.error;
      }

      products.forEach((product) => {
        if (product.id == id) {
          Object.entries(producto).map(([key, value]) => {
            if (key != "id") {
              product[key] = value;
              productFound[key] = value;
            }
          });
        }
      });

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );

      return productFound;
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE
  deleteProduct = async (id) => {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id == id);
      const product = products.find((product) => product.id == id);

      if (!products.length) {
        console.log("No hay productos para eliminar");
        return [];
      }
      if (!product) {
        console.log(`No existe un producto con id ${id}`);
        return [];
      }

      if (index == 0) {
        products.splice(index, index + 1);
      } else {
        products.splice(index, index);
      }

      await fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (error) {
      console.log(error);
      return { error };
    }
  };
}
