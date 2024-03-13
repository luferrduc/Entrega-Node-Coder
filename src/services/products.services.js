import Products from "../dao/dbManagers/products.manager.js"
import ProductsRepository from "../repositories/products.repository.js"
import { InvalidOwnerError } from "../utils/custom.exceptions.js"
import UsersRepository from "../repositories/users.repository.js"
import { deleteProductEmail } from "../utils/custom.html.js"
import { sendEmail } from "./mail.services.js"
import { Users as UsersDao } from "../dao/factory.js"

const productsRepository = new ProductsRepository()
const usersDao = new UsersDao()
const usersRepository = new UsersRepository(usersDao)

export const getProducts = async (options, sort, queryP, queryValue) => {
	const { limit, page } = options
	let sortLink = ""
	if (sort?.toLowerCase() === "asc") {
		options.sort = { price: 1 }
		sortLink = `&sort=${sort}`
	} else if (sort?.toLowerCase() === "desc") {
		options.sort = { price: -1 }
		sortLink = `&sort=${sort}`
	}
	if (queryP && queryValue) {
		options.query[queryP] = queryValue
	}
	//
	const key = Object.keys(options.query)[0]
	const value = Object.values(options.query)[0]
	if (key?.toLowerCase() === "stock") {
		options.query = {
			[key?.toLowerCase()]: { $gte: value }
		}
	} else if (key?.toLowerCase() === "category") {
		options.query = {
			[key?.toLowerCase()]: { $regex: value, $options: "i" }
		}
	} else {
		options.query = {}
	}

	const {
		docs: products,
		hasPrevPage,
		hasNextPage,
		nextPage,
		prevPage,
		totalPages
	} = await productsRepository.getAll(options)
	return {
		products,
		hasPrevPage,
		hasNextPage,
		nextPage,
		prevPage,
		totalPages,
		limit,
		page,
		sortLink
	}
}

export const getProduct = async (pid) => {
	const product = await productsRepository.getById(pid)
	return product
}

export const createProduct = async (product, user) => {
	product.owner = user.email
	const result = await productsRepository.create(product)
	return result
}

export const updateProduct = async (pid, product) => {
	const updatedProduct = await productsRepository.update(pid, product)
	return updatedProduct
}

export const deleteProduct = async (pid, user) => {
	let owner
	const product = await productsRepository.getById(pid)

	if (user.role === "premium" && user.email != product.owner) {
		throw new InvalidOwnerError("Premium user can only update their products")
	}
	if (product.owner !== "admin") {
		owner = await usersRepository.getByEmail(product.owner)
	}
	if (owner.role === "premium") {
		const html = deleteProductEmail(user.first_name, product)
		const email = {
			to: owner.email,
			subject: "Removed product",
			html
		}
		const sentMail = await sendEmail(email)
	}
	return product
}
