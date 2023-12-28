import { getCart as getCartServices } from "../services/carts.services.js";
import { createCart as createCartServices } from "../services/carts.services.js";
import { addProduct as addProductServices } from "../services/carts.services.js";
import { updateProducts as updateProductsServices } from "../services/carts.services.js";
import { updateCart as updateCartServices } from "../services/carts.services.js";
import { deleteProduct as deleteProductServices } from "../services/carts.services.js";
import { deleteCartProducts as deleteCartProductsServices } from "../services/carts.services.js";
import { purchaseProducts as purchaseProductsServices } from "../services/carts.services.js"
// Products
import { getProduct as getProductServices } from "../services/products.services.js"
import { login as getUser } from "../services/sessions.services.js";

export const getCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await getCartServices(cid);
    if (!cart)
      return res.sendNotFoundError("Cart not found");
    return res.sendSuccess(cart);
  } catch (error) {
    return res.sendServerError(error.message);
  }
}
export const createCart = async (req, res) => {
  try {
    const cart = await createCartServices();
    return res.sendSuccess(cart);
  } catch (error) {
    return res.sendServerError(error.message);
  }
}
export const addProduct = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const user = req.user
    // const cid = req.user.cart
    const product = await getProductServices(pid)
    if(!product) return res.sendNotFoundError("Product not found")

    const cart = await getCartServices(cid)
    if(!cart) return res.sendNotFoundError("Cart or product not found")

    const result = await addProductServices(cid, pid)
    return res.sendSuccess(result);
  } catch (error) {
    return res.sendServerError(error.message);
  }
}
export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params
    const { products } = req.body
    
    
    const cart = await getCartServices(cid)
    if(!cart) return res.sendNotFoundError("Cart not found")


    const updatedCart = await updateCartServices(cid, products);
    return res.sendSuccess(updatedCart);
  } catch (error) {
    return res.sendServerError(error.message);
  }
}
// Update quantiy in carts
export const updateProducts = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { cid, pid } = req.params

    const product = await getProductServices(pid)
    if(!product) return res.sendNotFoundError("Product not found")

    const cart = await getCartServices(cid)
    if(!cart) return res.sendNotFoundError("Cart not found")

    if (!quantity) return res.sendUnproccesableEntity("Quantity is required")

    const updatedQuantityCart = await updateProductsServices(cid, pid, quantity)
    return res.sendSuccess(updatedQuantityCart);
  } catch (error) {
    return res.sendServerError(error.message);
  }
}
// Delete all products in cart
export const deleteCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await getCartServices(cid)
    if(!cart) return res.sendNotFoundError("Cart not found")

    const result = await deleteCartProductsServices(cid)

    return res.sendSuccess(result);
  } catch (error) {
    if (error.message.toLowerCase().includes("not found"))
      return res.sendNotFoundError(error.message);
    return res.sendServerError(error.message);
  }
}
// Delete ONE product in cart
export const deleteProduct = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    
    const product = await getProductServices(pid)
    if(!product) return res.sendNotFoundError("Product not found")

    const cart = await getCartServices(cid)
    if(!cart) return res.sendNotFoundError("Cart not found")

    const result = await deleteProductServices(cid, pid);

    return res.sendSuccess(result);
  } catch (error) {
    if (error.message.toLowerCase().includes("not found"))
      return res.sendNotFoundError(error.message);
    return res.sendServerError(error.message);
  }
}

export const purchaseProducts = async (req, res) => {
  try {
    const { cid } = req.params
    const  user  = req.user
    
    const cart = await getCartServices(cid)
    if(!cart) return res.sendNotFoundError("cart not found")
    if(cart.products.length === 0) return res.sendUnproccesableEntity("there are not products in this cart")
    if(!user) return res.sendClientError("user is required")

    const result = await purchaseProductsServices(cid, user)
    return res.sendSuccess(result)
  } catch (error) {
    return res.sendServerError(error.message);
  }
}