import Products from "../dao/dbManagers/products.manager.js";
import Carts from "../dao/dbManagers/carts.manager.js";
import Messages from "../dao/dbManagers/messages.manager.js";
import jwt from "jsonwebtoken";
import configs from "../config.js";

const productsManager = new Products();
const cartsManager = new Carts();
const messagesManager = new Messages();

export const realTimeProductsView = async (req, res) => {
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
		} = await productsManager.getAll(options);
		res.render("realtimeproducts", {
			products: productsList,
			user: req.user,
			hasPrevPage,
			hasNextPage,
			nextPage,
			prevPage
		});
	} catch (error) {
		req.logger.error(`${error.message}`);
		return res.status(500).send(`<h2>Error 500: ${error.message}</h2>`);
	}
};

export const productsView = async (req, res) => {
	try {
		const { limit = 10, page = 1, sort, query: queryP, queryValue } = req.query;
		const options = {
			limit,
			page,
			query: {}
		};

		let sortLink = "";
		if (sort?.toLowerCase() === "asc") {
			options.sort = { price: 1 };
			sortLink = `&sort=${sort}`;
		} else if (sort?.toLowerCase() === "desc") {
			options.sort = { price: -1 };
			sortLink = `&sort=${sort}`;
		}
		let queryLink = "";
		if (queryP && queryValue) {
			options.query[queryP] = queryValue;
			queryLink = `&query=${queryP}&queryValue=${queryValue}`;
		}

		const {
			docs: productsList,
			hasPrevPage,
			hasNextPage,
			nextPage,
			prevPage,
			totalPages
		} = await productsManager.getAll(options);
		const prevLink = hasPrevPage
			? `/products?limit=${limit}&page=${prevPage}${sortLink}${queryLink}`
			: null;
		const nextLink = hasNextPage
			? `/products?limit=${limit}&page=${nextPage}${sortLink}${queryLink}`
			: null;
		res.render("products", {
			user: req.user,
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
		req.logger.error(`${error.message}`);
		return res.status(500).send(`<h2>Error 500: ${error.message} </h2>`);
	}
};

export const productDetail = async (req, res) => {
	try {
		const { pid } = req.params;
		const product = await productsManager.getById(pid);
		if (!product)
			return res
				.status(404)
				.render(`<h2>Error 404: Product with id ${pid} not found </h2>`);
		return res.render("product", {
			product,
			user: req.user,
			style: "product.css"
		});
	} catch (error) {
		req.logger.error(`${error.message}`);
		return res.status(500).send(`<h2>Error 500: ${error.message} </h2>`);
	}
};

export const cartDetail = async (req, res) => {
	try {
		const { cart: userCart } = req.user;
		const { _id: cid } = userCart;
		const cart = await cartsManager.getById(cid);
		if (!cart)
			return res
				.status(400)
				.render(`<h2>Error 404: Cart with id ${cid} not found </h2>`);
		const products = cart.products;
		return res.render("cart", {
			cart,
			products,
			user: req.user,
			style: "cart.css"
		});
	} catch (error) {
		req.logger.error(`${error.message}`);
		return res.status(500).send(`<h2>Error 500: ${error.message}</h2>`);
	}
};

export const chat = async (req, res) => {
	const messagesList = await messagesManager.getAll();
	return res.render("chat", { messages: messagesList, style: "chat.css" });
};

export const login = async (req, res) => {
	return res.render("login", { style: "login.css" });
};

export const register = (req, res) => {
	res.render("register", { style: "register.css" });
};

export const profile = (req, res) => {
	res.render("profile", {
		user: req.user,
		style: "profile.css"
	});
};

export const passwordLinkView = async (req, res) => {
	try {
		res.render("passwordLink", {
			style: "passwordLink.css"
		});
	} catch (error) {}
};

export const resetPasswordView = async (req, res) => {
	try {
		const token = req.query.token;
		const PRIVATE_KEY = configs.privateKeyJWT;
		// TODO: revisar token y renderizar página correspondiente
		console.log(token);
		jwt.verify(token, PRIVATE_KEY, (error, decoded) => {
			// TODO: Si existe error, renderizar o rediregir a otra página
			if (error) {
				if (error.name === "TokenExpiredError") {
					return res.redirect("/passwordLinkView");
				} else if (error.name != "TokenExpiredError") {
					return res.render("500", {
						style: "500.css",
						error
					});
				}
			} else {
				// TODO: Si no, renderizar página de cambio de contraseña
				console.log(decoded);
				return res.render("passwordChange", {
					email: decoded.user.email,
					style: "passwordChange.css"
				});
			}
		});
	} catch (error) {
		req.logger.error(error.message);
		return res.render("500", {
			style: "500.css",
			error
		});
	}
};
