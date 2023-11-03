import { Router } from "express";
// import ProductManager from "../dao/fileManagers/product-file.manager.js";
import ProductManager from "../dao/dbManagers/products.manager.js";
import CartManaget from "../dao/dbManagers/carts.manager.js";
import MessagesManager from "../dao/dbManagers/messages.manager.js";
import { productsFilePath } from "../utils.js";

const router = Router();
// const productManager = new ProductManager(productsFilePath);
const productManager = new ProductManager();
const cartsManager = new CartManaget();
const messageManager = new MessagesManager();

// Vista para mostrar productos sin WebSockets
router.get("/", async (req, res) => {
	const productsList = await productManager.getAll();
	res.render("home", { products: productsList });
});

// Vista para mostrar productos en tiempo real con WebSockets
router.get("/realtimeproducts", async (req, res) => {
	try {
		const { limit = 10, page = 1, sort, query = {} } = req.query;
		const options = {
			limit,
			page,
			query
		};
		if (sort?.toLowerCase() === "asc") {
			options.sort = { price: 1 };
		} else if (sort?.toLowerCase() === "desc") {
			options.sort = { price: -1 };
		}
		const {
			docs: productsList,
			hasPrevPage,
			hasNextPage,
			nextPage,
			prevPage
		} = await productManager.getAll(options);
		res.render("realtimeproducts", {
			products: productsList,
			hasPrevPage,
			hasNextPage,
			nextPage,
			prevPage
		});
	} catch (error) {
		return res.status(500).render(`<h2>Error 500: ${error.message}</h2>`);
	}
});
router.get("/products", async (req, res) => {
	try {
		const { limit = 10, page = 1, sort, query = {} } = req.query;
		const options = {
			limit,
			page,
			query
		};

		let sortLink = "";
		if (sort?.toLowerCase() === "asc") {
			options.sort = { price: 1 };
			sortLink = `&sort=${sort}`;
		} else if (sort?.toLowerCase() === "desc") {
			options.sort = { price: -1 };
			sortLink = `&sort=${sort}`;
		}

		const {
			docs: productsList,
			hasPrevPage,
			hasNextPage,
			nextPage,
			prevPage,
			totalPages
		} = await productManager.getAll(options);

		const prevLink = hasPrevPage
			? `/api/products?limit=${limit}&page=${prevPage}${sortLink}`
			: null;
		const nextLink = hasNextPage
			? `/api/products?limit=${limit}&page=${nextPage}${sortLink}`
			: null;

		res.render("products", {
			products: productsList,
			totalPages,
			prevPage,
			nextPage,
			page,
			hasPrevPage,
			hasNextPage,
			prevLink,
			nextLink,
			style: "products.css"
		});
	} catch (error) {
		return res.status(500).render(`<h2>Error 500: ${error.message}</h2>`);
	}
});
router.get("/carts/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const cart = await cartsManager.getById(cid);
		if (!cart)
			return res
				.status(400)
				.render(`<h2>Error 404: Cart with id ${cid} not found </h2>`);

		return res.render("cart", {
			cart,
			style: "cart.css"
		});
	} catch (error) {
		return res.status(500).render(`<h2>Error 500: ${error.message}</h2>`);
	}
});
// Vista para entregar los mensajes y la hoja de estilos
router.get("/chat", async (req, res) => {
	const messagesList = await messageManager.getAll();
	res.render("chat", { messages: messagesList, style: "chat.css" });
});

export default router;