import { Products as ProductsDao } from "../dao/factory.js";

export default class ProductsRepository {
	constructor() {
		this.dao = new ProductsDao();
	}

	getAll = async (options) => {
		const result = await this.dao.getAll(options);
		return result;
	};

	getById = async (pid) => {
		const result = await this.dao.getById(pid);
		return result;
	};

	create = async (product) => {
		const result = await this.dao.create(product);
		return result;
	};

	update = async (pid, product) => {
    const result = await this.dao.update(pid, product);
    return result
	};

	delete = async (pid) => {
		const result = await this.dao.delete(pid);
		return result;
	};
}
