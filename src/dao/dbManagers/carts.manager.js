import { cartsModel } from "./models/carts.model.js";

export default class Carts {
  constructor() {}

  getAll = async () => {
    const carts = await cartsModel.find().lean();
    return carts;
  };

  getById = async (id) => {
    const cart = await cartsModel.findById({ _id: id });
    return cart;
  };

  create = async () => {
    const result = await cartsModel.create({});
    return result;
  };

  addProduct = async (cid, pid) => {
    const cart = await cartsModel.findById({ _id: cid });


    if (cart?.products?.length > 0) {
      const productIndex = cart.products?.findIndex((prod) => prod["_id"] == pid);

      if (productIndex === -1) {
        cart.products?.push({ _id: pid, quantity: 1 });
      } else {
        cart.products[productIndex].quantity = cart.products[productIndex].quantity+1
      }
    } else {
      cart.products?.push({ _id: pid, quantity: 1 });
  
    }
    const result = await cartsModel.updateOne({ _id: cid }, cart);

    return cart;
  };
}
