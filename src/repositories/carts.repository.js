import { Carts as CartsDao } from "../dao/factory.js";

export default class CartsRepository {
	constructor() {
		this.dao = new CartsDao();
	}

	getCartById = async (cid) => {
		const result = await this.dao.getById(cid);
		return result;
	};

	create = async () => {
		const result = await this.dao.create();
		return result;
	};

	addProduct = async (cid, pid) => {
		const result = await this.dao.addProduct(cid, pid);
		return result;
	};

	updateCart = async (cid, products) => {
		const result = await this.dao.updateCart(cid, products);
		return result;
	};

	updateProducts = async (cid, pid, quantity) => {
		const result = await this.dao.updateQuantityProduct(cid, pid, quantity);
		return result;
	};

	deleteCartProducts = async (cid) => {
		const result = await this.dao.deleteProducts(cid);
		return result;
	};

  deleteProductCart = async (cid, pid) => {
    const result = await this.dao.deleteProductCart(cid, pid);
    return result
  };

}
