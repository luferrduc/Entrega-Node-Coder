import { Router } from "express";
// import CartManager from "../dao/fileManagers/cart-file.manager.js";
import CartsManager from "../dao/dbManagers/carts.manager.js";
import ProductManager from "../dao/dbManagers/products.manager.js";

import { cartsFilePath } from "../utils.js";

const router = Router();
// const manager = new CartManager(cartsFilePath);
const manager = new CartsManager();
const productManager = new ProductManager();
router
  .get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    try {
      const cart = await manager.getById(cid);
      if (!cart)
        return res
          .status(400)
          .send({ status: "error", error: "Cart not found" });

      return res.send({ status: "success", payload: cart });
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  })
  .post("/", async (req, res) => {
    try {
      const cart = await manager.create();
      return res.send({ status: "success", payload: cart });
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  })
  .post("/:cid/product/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const product = await productManager.getById(pid)
      if (!product)
        return res
          .status(404)
          .send({ status: "error", error: "Product not found" });

      const cart = await manager.addProduct(cid, pid);
      if (!cart)
        return res
          .status(404)
          .send({ status: "error", error: "Cart or product not found" });
      return res.send({ status: "success", payload: cart });
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  });

export default router;
