import productsModel from "./models/products.model.js";

export default class Products {
	getAll = async ({ limit, page, sort, query }) => {
		const products = await productsModel.paginate(query, {
			limit,
			page,
			sort,
			lean: true
		});
		return products;
	};
	getById = async (id) => {
		const product = await productsModel.findOne({ _id: id }).lean();
		return product;
	};

	create = async (product) => {
		const result = await productsModel.create(product);
		return result;
	};

	update = async (id, product) => {
		const result = await productsModel.updateOne({ _id: id }, product);
		const newProduct = await productsModel.findById(id);
		return newProduct;
	};

	delete = async (id) => {
		const result = await productsModel.deleteOne({ _id: id });
		return result;
	};
}
