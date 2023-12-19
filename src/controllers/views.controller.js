import { cartDetail as cartDetailServices } from "../services/views.services.js"
import { chat as chatServices } from "../services/views.services.js"
import { login as loginServices } from "../services/views.services.js"
import { productDetail as productDetailServices } from "../services/views.services.js"
import { profile as profileServices } from "../services/views.services.js"
import { productsView as productsViewServices } from "../services/views.services.js"
import { register as registerServices } from "../services/views.services.js"
import { realTimeProductsView as realTimeProductsViewServices } from "../services/views.services.js"

import Products from "../dao/dbManagers/products.manager.js";
import Carts from "../dao/dbManagers/carts.manager.js";
import Messages from "../dao/dbManagers/messages.manager.js";


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
    return res.status(500).send(`<h2>Error 500: ${error.message}</h2>`);
  }
}

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
    return res.status(500).send(`<h2>Error 500: ${error.message} </h2>`);
  }
}

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
    return res.status(500).send(`<h2>Error 500: ${error.message} </h2>`);
  }
}

export const cartDetail = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartsManager.getById(cid);
    if (!cart)
      return res
        .status(400)
        .render(`<h2>Error 404: Cart with id ${cid} not found </h2>`);
    const products = cart.products;
    return res.render("cart", {
      products,
      user: req.user,
      style: "cart.css"
    });
  } catch (error) {
    return res.status(500).send(`<h2>Error 500: ${error.message}</h2>`);
  }
}

export const chat = async (req, res) => {
  const messagesList = await messagesManager.getAll();
  return res.render("chat", { messages: messagesList, style: "chat.css" });
}
	
export const login = async (req, res) => {
  return res.render("login", { style: "login.css" });
}

export const register = (req, res) => {
  res.render("register", { style: "register.css" });
}

export const profile = (req, res) => {
  res.render("profile", {
    user: req.user,
    style: "profile.css"
  });
}