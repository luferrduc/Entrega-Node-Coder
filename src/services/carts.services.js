import Carts from "../dao/dbManagers/carts.manager.js";
import Products from "../dao/dbManagers/products.manager.js";
import { validateCart } from "../schemas/carts.schema.js";
import CartsRepository from "../repositories/carts.repository.js";
import ProductsRepository from "../repositories/products.repository.js";
// import CartManager from "../dao/fileManagers/cart-file.manager.js";
import { cartsFilePath } from "../utils.js";
import { generateTicket } from "./tickets.services.js";

const productsManager = new Products();
const cartsManager = new Carts();
const cartsRepository = new CartsRepository();
const productsRepository = new ProductsRepository();

export const getCart = async (cid) => {
	const cart = await cartsRepository.getCartById(cid);
	// const cart = await cartsManager.getById(cid);
	return cart;
};

export const createCart = async () => {
	// const cart = await cartsManager.create();
	const cart = await cartsRepository.create();
	return cart;
};

export const addProduct = async (cid, pid) => {
	const cart = await cartsRepository.addProduct(cid, pid);
	return cart;
};

export const updateCart = async (cid, products) => {
	const updatedCart = await cartsRepository.updateCart(cid, products);
	return updatedCart;
};

export const updateProducts = async (cid, pid, quantity) => {
	const updatedQuantityCart = await cartsRepository.updateQuantityProduct(
		cid,
		pid,
		quantity
	);
	return updatedQuantityCart;
};

// Delete all products in cart
export const deleteCartProducts = async (cid) => {
	const result = await cartsRepository.deleteCartProducts(cid);
	return result;
};

// Delete one product in cart
export const deleteProduct = async (cid, pid) => {
	const result = await cartsRepository.deleteProductCart(cid, pid);
	return result;
};

export const purchaseProducts = async (cid, user) => {
	const cart = await cartsRepository.getCartById(cid);
	const outStock = [];
	let amount = 0;
	cart.products.forEach(async ({ product, quantity }) => {
		if (product.stock >= quantity) {
			amount += product.price * quantity;
			product.stock -= quantity;
			
			await productsRepository.update(product._id, product);
		} else {
			outStock.push({ product, quantity });
		}
	})

	const ticket = await generateTicket(user, amount)	
	const cartUpdated = await cartsRepository.updateCart(cid, outStock)

	return {ticket, cartUpdated}
};
