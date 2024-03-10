// TODO: Cambiar los managers para usar los servicios
import Products from "../dao/dbManagers/products.manager.js"
import Carts from "../dao/dbManagers/carts.manager.js"
import Messages from "../dao/dbManagers/messages.manager.js"
import { usersView as usersViewServices } from "../services/views.services.js"
import jwt from "jsonwebtoken"
import configs from "../config.js"

const productsManager = new Products()
const cartsManager = new Carts()
const messagesManager = new Messages()

export const realTimeProductsView = async (req, res) => {
	try {
		const { limit = 10, page = 1, sort, query = {} } = req.query
		const options = {
			limit,
			page,
			query
		}
		if (sort?.toLowerCase() === "asc") {
			options.sort = { price: 1 }
		} else if (sort?.toLowerCase() === "desc") {
			options.sort = { price: -1 }
		}
		const {
			docs: productsList,
			hasPrevPage,
			hasNextPage,
			nextPage,
			prevPage
		} = await productsManager.getAll(options)
		const user = req.user
    user.isAdmin = user.role === "admin"
		res.render("realtimeproducts", {
			products: productsList,
			user,
			hasPrevPage,
			hasNextPage,
			nextPage,
			prevPage
		})
	} catch (error) {
		req.logger.error(`${error.message}`)
		return res
			.status(500)
			.render("500", { style: "500.css", message: `${error.message}` })
	}
}

export const productsView = async (req, res) => {
	try {
		const { limit = 10, page = 1, sort, query: queryP, queryValue } = req.query
		const options = {
			limit,
			page,
			query: {}
		}
		console.log(req.user)
		let sortLink = ""
		if (sort?.toLowerCase() === "asc") {
			options.sort = { price: 1 }
			sortLink = `&sort=${sort}`
		} else if (sort?.toLowerCase() === "desc") {
			options.sort = { price: -1 }
			sortLink = `&sort=${sort}`
		}
		let queryLink = ""
		if (queryP && queryValue) {
			options.query[queryP] = queryValue
			queryLink = `&query=${queryP}&queryValue=${queryValue}`
		}

		const {
			docs: productsList,
			hasPrevPage,
			hasNextPage,
			nextPage,
			prevPage,
			totalPages
		} = await productsManager.getAll(options)
		const prevLink = hasPrevPage
			? `/products?limit=${limit}&page=${prevPage}${sortLink}${queryLink}`
			: null
		const nextLink = hasNextPage
			? `/products?limit=${limit}&page=${nextPage}${sortLink}${queryLink}`
			: null
		const user = req.user
		user.isAdmin = user.role === "admin"
		res.render("products", {
			user,
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
		})
	} catch (error) {
		req.logger.error(`${error.message}`)
		return res
			.status(500)
			.render("500", { style: "500.css", message: `${error.message}` })
	}
}

export const productDetail = async (req, res) => {
	try {
		const { pid } = req.params
		const product = await productsManager.getById(pid)
		if (!product)
			return res.status(404).render("404", {
				message: `Product with id ${pid} not found`
			})
		const user = req.user
		user.isAdmin = user.role === "admin"
		return res.render("product", {
			product,
			user,
			style: "product.css"
		})
	} catch (error) {
		req.logger.error(`${error.message}`)
		return res
			.status(500)
			.render("500", { style: "500.css", message: `${error.message}` })
	}
}

export const cartDetail = async (req, res) => {
	try {
		const { cart: userCart } = req.user
		const { _id: cid } = userCart
		const cart = await cartsManager.getById(cid)
		if (!cart)
			return res.status(404).render("404", {
				message: `Cart with id ${cid} not found`
			})
		const products = cart.products
		const user = req.user
		user.isAdmin = user.role === "admin"
		return res.render("cart", {
			cart,
			products,
			user,
			style: "cart.css"
		})
	} catch (error) {
		req.logger.error(`${error.message}`)
		return res
			.status(500)
			.render("500", { style: "500.css", message: `${error.message}` })
	}
}

export const chat = async (req, res) => {
	const messagesList = await messagesManager.getAll()
	return res.render("chat", { messages: messagesList, style: "chat.css" })
}

export const login = async (req, res) => {
	try {
		if (req.cookies["coderCookieToken"]) {
			return res.redirect("/")
		}
		return res.render("login", { style: "login.css" })
	} catch (error) {
		req.logger.error(`${error.message}`)
		return res.status(500).render("500", {
			style: "500.css",
			error
		})
	}
}

export const register = (req, res) => {
	try {
		if (req.cookies["coderCookieToken"]) {
			return res.redirect("/")
		}
		return res.render("register", { style: "register.css" })
	} catch (error) {
		req.logger.error(`${error.message}`)
		return res.status(500).render("500", {
			style: "500.css",
			error
		})
	}
}

export const profile = (req, res) => {
	try {
		const user = req.user
		user.isAdmin = user.role === "admin"
		return res.render("profile", {
			user,
			style: "profile.css"
		})
	} catch (error) {
		req.logger.error(`${error.message}`)
		return res.status(500).render("500", {
			style: "500.css",
			error
		})
	}
}

export const passwordLinkView = async (req, res) => {
	try {
		res.render("passwordLink", {
			style: "passwordLink.css"
		})
	} catch (error) {
		return res.status(500).render("500", {
			style: "500.css",
			error
		})
	}
}

export const resetPasswordView = async (req, res) => {
	try {
		const token = req.query.token
		const PRIVATE_KEY = configs.privateKeyJWT
		//* revisar token y renderizar página correspondiente
		jwt.verify(token, PRIVATE_KEY, (error, decoded) => {
			//* Si existe error, renderizar o rediregir a otra página
			if (error) {
				if (error.name === "TokenExpiredError") {
					return res.redirect("/passwordLinkView")
				} else if (error.name != "TokenExpiredError") {
					return res.render("500", {
						style: "500.css",
						error
					})
				}
			} else {
				//* Si no, renderizar página de cambio de contraseña
				return res.render("passwordChange", {
					email: decoded.user.email,
					style: "passwordChange.css"
				})
			}
		})
	} catch (error) {
		req.logger.error(error.message)
		return res.status(500).render("500", {
			style: "500.css",
			error
		})
	}
}
// TODO: Find the way to add users id to handlebars template users
export const usersView = async (req, res) => {
	try {
		const users = await usersViewServices()
		return res.render("users", {
			users: users || [],
			style: "users.css"
		})
	} catch (error) {
		req.logger.error(error.message)
		return res.status(500).render("500", {
			style: "500.css",
			error
		})
	}
}
