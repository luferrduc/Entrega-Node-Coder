import { Router } from "express";
import CartManager from "../managers/CartManager.js";
import { cartsFilePath } from "../utils.js";

const router = Router();
const manager = new CartManager(cartsFilePath);

router
  .get("/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const cart = await manager.getCartById(cid);
    if (cart.status === "error")
      return res.status(400).send({ status: "error", error: cart.error });

    if(cart.status === "server error")
      return res.status(500).send({ status: "error", error: cart.error });
    
    return res.send({ status: "success", payload: cart });
  })
  .post("/", async (req, res) => {
    const cart = await manager.addCart();
    if (cart.status === "server error")
      return res
        .status(500)
        .send({ status: "error", error: cart.error });
    return res.send({ status: "success", payload: cart });
  })
  .post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const carts = await manager.addProductToCart(parseInt(cid), parseInt(pid))
    if(carts.status === "error") return res.status(400).send({ status: "error", error: carts.error });
    return res.send({ status: "success", payload: carts });
  });

export default router;
