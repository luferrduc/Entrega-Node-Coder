import Products from "../dao/dbManagers/products.manager.js";
import ProductsRepository from "../repositories/products.repository.js";
import { InvalidOwnerError } from "../utils/custom.exceptions.js";
import UsersRepository from "../repositories/users.repository.js";


const productsRepository = new ProductsRepository()
const usersRepository = new UsersRepository()

export const getProducts = async (options, sort, queryP, queryValue) => {

	const { limit, page } = options
	let sortLink = "";
	if (sort?.toLowerCase() === "asc") {
		options.sort = { price: 1 };
		sortLink = `&sort=${sort}`;
	} else if (sort?.toLowerCase() === "desc") {
		options.sort = { price: -1 };
		sortLink = `&sort=${sort}`;
	}
	if (queryP && queryValue) {
		options.query[queryP] = queryValue;
	}
  // 
	const key = Object.keys(options.query)[0];
	const value = Object.values(options.query)[0];
	if (key?.toLowerCase() === "stock") {
		options.query = {
			[key?.toLowerCase()]: { $gte: value }
		};
	} else if (key?.toLowerCase() === "category") {
		options.query = {
			[key?.toLowerCase()]: { $regex: value, $options: "i" }
		};
	} else {
		options.query = {};
	}
	
	const {
		docs: products,
		hasPrevPage,
		hasNextPage,
		nextPage,
		prevPage,
		totalPages
	} = await productsRepository.getAll(options);
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
  };
};

export const getProduct = async (pid) => {
	const product = await productsRepository.getById(pid)
	return product
};

export const createProduct = async (product, user) => {
	const result = await productsRepository.create(product)
	return result
};

export const updateProduct = async (pid, product) => {
	const updatedProduct = await productsRepository.update(pid, product);
	return updatedProduct
};

export const deleteProduct = async (pid, user) => {
	const product = await productsRepository.getById(pid)

	if(user.role === "premium" && user.email != product.owner){
			throw new InvalidOwnerError("Premium user can only update their products")
	}
	const deletedProduct = await productsRepository.delete(pid);
	return deletedProduct
};
