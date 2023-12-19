import Carts from "../dao/dbManagers/carts.manager.js";
import Products from "../dao/dbManagers/products.manager.js";
import { validateCart } from "../schemas/carts.schema.js";
// import CartManager from "../dao/fileManagers/cart-file.manager.js";
import { cartsFilePath } from "../utils.js";

const productsManager = new Products();
const cartsManager = new Carts();

export const getCart = async (cid) => {
	const cart = await cartsManager.getById(cid);
	return cart;
};
export const createCart = async () => {
	const cart = await cartsManager.create();
	return cart;
};
export const addProduct = async (cid, pid) => {
	const cart = await cartsManager.addProduct(cid, pid);
	return cart;
};
export const updateCart = async (cid, products) => {
	const updatedCart = await cartsManager.updateCart(cid, products);
	return updatedCart;
};
export const updateProducts = async (cid, pid, quantity) => {
	const updatedQuantityCart = await cartsManager.updateQuantityProduct(
		cid,
		pid,
		quantity
	);
	return updatedQuantityCart
};
// Delete all products in cart
export const deleteCartProducts = async (cid) => {
	const result = await cartsManager.deleteProducts(cid);
	return result;
};
// Delete one product in cart
export const deleteProduct = async (cid, pid) => {
	const result = await cartsManager.deleteProductCart(cid, pid);
	return result
};
