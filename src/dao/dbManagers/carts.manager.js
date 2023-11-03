import { cartsModel } from "./models/carts.model.js";

export default class Carts {
  constructor() {}

  getAll = async () => {
    const carts = await cartsModel.find().lean();
    return carts;
  };

  getById = async (id) => {
    const cart = await cartsModel.findById({ _id: id }).lean()
    return cart;
  };

  create = async () => {
    const result = await cartsModel.create({});
    return result;
  };

  addProduct = async (cid, pid) => {
    const cart = await cartsModel.findById({ _id: cid });

    if(!cart) return null
    
    if (cart?.products?.length > 0) {
      const productIndex = cart.products?.findIndex((prod) => prod["product"] == pid);

      if (productIndex === -1) {
        cart.products?.push({ product: pid, quantity: 1 });
      } else {
        cart.products[productIndex].quantity = cart.products[productIndex].quantity+1
      }
    } else {
      cart.products?.push({ product: pid, quantity: 1 });
  
    }
    const result = await cartsModel.updateOne({ _id: cid }, cart);

    return cart;
  };

  deleteProductCart = async (cid, pid) => {
    // const cart = await cartsModel.findById({ _id: cid })
    const result = await cartsModel.updateOne({ _id: cid }, { $pull: { products: { product: { _id: pid }}}})    
    return result
  }

  deleteProducts = async (cid) => {

  }

  updateQuantityProduct = async (cid, pid, quantity) => {

  }

  updateCart = async (cid, products) => {

  }

}