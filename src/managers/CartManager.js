import fs from "node:fs";
/*
CARTS:
[
  {
    id: 1,
    products: [
      {
        id:1,
        quantity: 2
      },
      {
        id:2,
        quantity: 3
      }
    ]
  }
]
*/
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
        return []
      }
    } catch (error) {
      return { status: "server error", error: error.message };
    }
  };

  // GET BY ID
  getCartById = async (id) => {
    try {
      const carts = await this.getCarts();
      const cartFound = carts.find((cart) => {
        return cart.id === id;
      });
      if (!cartFound) return { status: "error", error: "404 Not Found" };

      return cartFound;
    } catch (error) {
      return { status: "server error", error: error.message };
    }
  };

  // ADD
  addCart = async () => {
    try {
      const cart = {}
      const carts = await this.getCarts();
      
      if (!carts.length) {
        cart.id = 1;
      } else {
        cart.id = carts[carts.length - 1].id + 1;
      }
      cart.products = []

      carts.push(cart);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carts, null, "\t")
      );
 
      return cart;
    } catch (error) {
      return { status: "server error", error: error.message };
    }
  };

  addProductToCart = async (cid, pid) => {

    // const productManager 
    const carts = await this.getCarts()

    const cart = await this.getCartById(cid)
    if(cart.status === "error") return { status: "error", error: "404 Cart Not Found" }
    
    // const productExists = 


    const cartIndex = carts.findIndex( ct => ct.id === cid )
    const productIndex = carts[cartIndex].products.findIndex(prod => prod.id === pid)
    
    if(productIndex === -1){
      carts[cartIndex].products.push({id: pid, quantity: 1})
    }else{
      carts[cartIndex].products[productIndex].quantity = carts[cartIndex].products[productIndex].quantity + 1
    }

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(carts, null, "\t")
    );

    return carts
  }

  
}
