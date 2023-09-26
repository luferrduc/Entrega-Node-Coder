import fs from "node:fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  // GET ALL
  getCarts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const carts = JSON.parse(data);
        return carts;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      return { error };
    }
  };

  // GET BY ID
  getCartById = async (id) => {
    try {
      const carts = await this.getCarts();
      const cartFound = carts.find((cart) => {
        return cart.id == id;
      });
      if (!cartFound) return { error: "Error: 404 Not Found" };

      return cartFound;
    } catch (error) {
      console.log(error);
      return { error };
    }
  };

  // ADD
  addCart = async (cart) => {
    const { title, description, price, thumbnail, code, stock } = cart;
    const error = {};
    // Validacion de campos
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log(
        "Error: El cart no fue ingresado, todos los campos son obligatorios"
      );
      return {
        error:
          "Error: El cart no fue ingresado, todos los campos son obligatorios",
      };
    }

    try {
      const carts = await this.getCarts();

      if (!carts.length) {
        // CODE único
        const cartCode = carts.find((cart) => cart.code === code);
        if (cartCode) {
          error.error = `Error: El código ${code} del carto ingresado ya se encuentra en otro carto.`;
          console.log(
            `Error: El código ${code} del carto ingresado ya se encuentra en otro carto.`
          );
          return { error };
        }
        cart.id = 1;
      } else {
        cart.id = carts[carts.length - 1].id + 1;
      }

      carts.push(cart);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carts, null, "\t")
      );
      console.log("carto agregado correctamente");
      return cart;
    } catch (error) {
      console.log(error);
      return { error };
    }
  };

  // UPDATE
  updateCart = async (id, cart) => {
    const { title, description, price, thumbnail, code, stock } = cart;
    // Validacion de campos

    if (!cart) {
      console.log("Error: No se puede actualizar con un cart vacío");
      return;
    }

    try {
      const carts = await this.getCarts();
      const cartFound = await this.getCartById(id);
      if (cartFound.error) {
        return cartFound.error;
      }

      carts.forEach((cart) => {
        if (cart.id == id) {
          Object.entries(cart).map(([key, value]) => {
            if (key != "id") {
              cart[key] = value;
              cartFound[key] = value;
            }
          });
        }
      });

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carts, null, "\t")
      );

      return cartFound;
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE
  deleteCart = async (id) => {
    try {
      const carts = await this.getCarts();
      const index = carts.findIndex((cart) => cart.id == id);
      const cart = carts.find((cart) => cart.id == id);

      if (!carts.length) {
        console.log("No hay carts para eliminar");
        return [];
      }
      if (!cart) {
        console.log(`No existe un cart con id ${id}`);
        return [];
      }

      if (index == 0) {
        carts.splice(index, index + 1);
      } else {
        carts.splice(index, index);
      }

      await fs.promises.writeFile(this.path, JSON.stringify(carts));
    } catch (error) {
      console.log(error);
      return { error };
    }
  };
}
