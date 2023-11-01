import { Router } from "express";
// import ProductManager from "../dao/fileManagers/product-file.manager.js";
import ProductManager from "../dao/dbManagers/products.manager.js";

import { productsFilePath } from "../utils.js";

const router = Router();
// const manager = new ProductManager(productsFilePath);
const manager = new ProductManager();

router
  .get("/", async (req, res) => {
    try {
      const { limit = 10, page=1, sort, ...query  } = req.query;
      const options = {
        limit,
        page,
        query
      }
      console.log(query)
      console.log(options)
      let sortLink = ""
      if(sort?.toLowerCase() === "asc"){
        options.sort = { price: 1 }
        sortLink = `&sort=${sort}`
      }else if(sort?.toLowerCase() === "desc"){
        options.sort = { price: -1 }
        sortLink = `&sort=${sort}`
      }
      // TODO: Ver la forma de usar un rest operator para obtener el resto de query params
      // que no sean los que ya se tienen y ocupar eso como query para los filtros 


      // const querys = ["title","description", "price", "code", "stock", "status"]
      // if(querys.includes(query.toLowerCase())){
      //   options.query = { [query] : query }
      // }

      const {docs: products, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages} = await manager.getAll(options);
      if (!products)
        return res.status(200).send({ status: "success", payload: [] });
  
      // const filteredProducts = products.slice(0, parseInt(limit));
      const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${prevPage}${sortLink}` : null
      const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${nextPage}${sortLink}` : null

      return res.send({ status: "success", payload: products, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink });
      // return res.send({ status: "success", payload: filteredProducts });

    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  })

  .get("/:pid", async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await manager.getById(pid);
      if (!product)
        return res.status(404).send({ status: "error", error: "Product not found" });

      return res.send({ status: "success", payload: product });
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  })
  .post("/", async (req, res) => {

    try {
      const product = req.body;
      const io = req.app.get("socketio");
      const { title, description, price, thumbnail, code, stock, status } =
        product;
      if (!title || !description || !price || !code || !stock)
        return res
          .status(400)
          .send({ status: "error", error: "Incomplete values" });
      const newProduct = await manager.create(product);
      io.emit("refreshProducts", await manager.getAll());
      return res.send({ status: "success", payload: newProduct });
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  })
  .put("/:pid", async (req, res) => {
    try {
      const { pid } = req.params;
      const product = req.body;
      const { title, description, price, thumbnail, code, stock, status } =
        product;
      if (!title || !description || !price || !code || !stock)
        return res
          .status(400)
          .send({ status: "error", error: "Incomplete values" });

      const productExists = await manager.getById(pid);
      if (!productExists)
        return res
          .status(404)
          .send({ status: "error", error: "Product not found, incorrect id" });

      const updatedProduct = await manager.update(pid, product);
      return res.send({
        status: "success",
        payload:  updatedProduct,
      });
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  })
  .delete("/:pid", async (req, res) => {
    try {
      const { pid } = req.params;
     
      const io = req.app.get("socketio");
      const deletedProduct = await manager.delete(pid);
      if (deletedProduct.deletedCount === 0)
        return res
          .status(400)
          .send({ status: "error", error: "Product not found, incorrect id" });
  
      io.emit("refreshProducts", await manager.getAll());
      return res.send({ status: "success", payload: "Product deleted succesfully" });
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
      
    }
   
  });

export default router;
