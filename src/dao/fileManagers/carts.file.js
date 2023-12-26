import fs from "node:fs";
import { productsFilePath } from "../../utils.js";
import ProductManager from "./products.file.js";
import { v4 as uuidv4 } from "uuid";
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
	getAll = async () => {
		if (fs.existsSync(this.path)) {
			const data = await fs.promises.readFile(this.path, "utf-8");
			const carts = JSON.parse(data);
			return carts;
		} else {
			return [];
		}
	};

	// GET BY ID
	getById = async (id) => {
		const carts = await this.getCarts();

		const cartFound = carts.find((cart) => {
			return cart.id === id;
		});
		return cartFound;
	};

	// ADD
	create = async () => {
		const cart = {};
		const carts = await this.getCarts();
		const id = uuidv4();

		// if (!carts.length) {
		// 	cart._id = id;
		// } else {
		// 	cart.id = carts[carts.length - 1].id + 1;
		// }
		cart._id = id;
		cart.products = [];

		carts.push(cart);
		await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));

		return cart;
	};

	addProduct = async (cid, pid) => {
		const productManager = new ProductManager(productsFilePath);
		const carts = await this.getCarts();

		const cart = await this.getCartById(cid);
		if (cart.status === "error")
			return { status: "error", error: "404 Cart Not Found" };

		const productExists = await productManager.getProductById(pid);
		if (productExists.status === "error")
			return { status: "error", error: "404 Product Not Found" };

		const cartIndex = carts.findIndex((ct) => ct.id === cid);
		const productIndex = carts[cartIndex].products.findIndex(
			(prod) => prod.id === pid
		);

		if (productIndex === -1) {
			carts[cartIndex].products.push({ id: pid, quantity: 1 });
		} else {
			carts[cartIndex].products[productIndex].quantity =
				carts[cartIndex].products[productIndex].quantity + 1;
		}

		await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));

		return carts;
	};

	updateQuantityProduct = async (cid, pid, quantity) => {
		
	}
}
