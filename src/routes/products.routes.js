import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import { productsFilePath } from "../utils.js";

const router = Router();
const manager = new ProductManager(productsFilePath);

router
  .get("/", async (req, res) => {
    const { limit } = req.query;
    const products = await manager.getProducts();
    if (products.error)
      return res.status(500).send({ status: "error", error: "Server Error" });
    // Limit validations
    if (!limit || parseInt(limit) > products.length)
      return res.send({ status: "success", payload: products });
    if (parseInt(limit) < 0)
      return res
        .status(400)
        .send({ status: "error", message: "Limit must be a positve number" });

    const filteredProducts = products.slice(0, parseInt(limit));
    return res.send({ status: "success", payload: filteredProducts });
  })

  .get("/:pid", async (req, res) => {
    const { pid } = req.params;
    const product = await manager.getProductById(parseInt(pid));
    if (product.status === "error")
      return res.send({ status: "error", error: product.error });

    return res.send({ status: "success", payload: product });
  })
  .post("/", async (req, res) => {
    const product = req.body;
    const { title, description, price, thumbnail, code, stock, status } =
      product;
    if (!title || !description || !price || !code || !stock)
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    const newProduct = await manager.addProduct(product);
    console.log(newProduct);
    if (newProduct.status === "error")
      return res.status(400).send({ status: "error", error: newProduct.error });

    return res.send({ status: "success", payload: newProduct });
  })
  .put("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    const product = req.body;
    const { title, description, price, thumbnail, code, stock, status } =
      product;
    if (!title || !description || !price || !code || !stock)
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    const updatedProduct = await manager.updateProduct(pid, product);
    if (updatedProduct.status === "error")
      return res
        .status(400)
        .send({ status: "error", error: updatedProduct.error });
    return res.send({
      status: "success",
      payload: { id: pid, ...updatedProduct },
    });
  })
  .delete("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);

    res.send("Deleting product");
  });

export default router;
