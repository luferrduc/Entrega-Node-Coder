import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import { productsFilePath } from "../utils.js";

const router = Router();
const manager = new ProductManager(productsFilePath);

router
  .get("/products", async (req, res) => {
    const { limit } = req.query;
    const products = await manager.getProducts();
    if (products.error)
      return res.send("Hubo un error en la lectura de la base de datos");
    if (!limit || parseInt(limit) > products.length) return res.send(products);
    if (parseInt(limit) < 0)
      return res
        .status(400)
        .send({ status: "error", message: "Limit must be a positve number" });

    const filteredProducts = products.slice(0, parseInt(limit));
    return res.send(filteredProducts);
  })

  .get("/products/:pid", async (req, res) => {
    const { pid } = req.params;
    const product = await manager.getProductById(parseInt(pid));
    if (product.error) return res.send(`<h1> Product ${product.error}</h1>`);

    return res.send(product);
  });


  export default router