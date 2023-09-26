import { Router } from "express";
import CartManager from "../managers/CartManager.js";
import { cartsFilePath } from "../utils.js";

const router = Router()
const manager = new CartManager(cartsFilePath);



export default router