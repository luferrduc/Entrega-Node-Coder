import { validateProduct } from "../schemas/products.schema.js";
import { getProducts as getProductsServices } from "../services/products.services.js";
import { getProduct as getProductServices } from "../services/products.services.js";
import { createProduct as createProductServices } from "../services/products.services.js";
import { updateProduct as updateProductServices } from "../services/products.services.js";
import { deleteProduct as deleteProductServices } from "../services/products.services.js";

export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query: queryP, queryValue } = req.query;
    const options = {
      limit,
      page,
      query: {}
    };
    const {
      products,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
      totalPages,
      sortLink
    } = await getProductsServices(options, sort, queryP, queryValue);
    if (!products)
      return res.sendSuccess([]);

    const prevLink = hasPrevPage
      ? `/api/products?limit=${limit}&page=${prevPage}${sortLink}`
      : null;
    const nextLink = hasNextPage
      ? `/api/products?limit=${limit}&page=${nextPage}${sortLink}`
      : null;

    return res.sendSuccess(
      products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    );
  } catch (error) {
    return res.sendServerError(error.message);
  }
}


export const getProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await getProductServices(pid);
    if (!product) return res.sendNotFoundError("Product not found");

    return res.sendSuccess(product);
  } catch (error) {
    return res.sendServerError(error.message);
  }
}

export const createProduct = async (req, res) => {
  try {
    const options = {
      limit: 10,
      page: 1,
      query: {}
    };
    const result = validateProduct(req.body);
    const io = req.app.get("socketio");
    if(result.error)
      return res.sendClientError(result.error);
    const newProduct = await createProductServices(result.data);
    const { products: productsEmit } = await getProductsServices(options);
    io.emit("refreshProducts", productsEmit);
    return res.sendSuccess(newProduct);
  } catch (error) {
    return res.sendServerError(error.message);
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const options = {
      limit: 10,
      page: 1,
      query: {}
    };
    const io = req.app.get("socketio");
    const result = validateProduct(req.body);
    if(result.error)
      return res.sendClientError(result.error);

    const productExists = await getProductServices(pid);

    if(!productExists) return res.sendNotFoundError("Product not found, incorrect id")

    const productUpdated = await updateProductServices(pid, result.data);
    const { products: productsEmit } = await getProductsServices(options);
    io.emit("refreshProducts", productsEmit);

    return res.sendSuccess(productUpdated);
  } catch (error) {
    return res.sendServerError(error.message);
  }
}
export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const options = {
      limit: 10,
      page: 1,
      query: {}
    };
    
    const io = req.app.get("socketio");
    
    const productExists = await getProduct(pid);
    if(!productExists) return res.sendNotFoundError("Product not found, incorrect id")

    const deletedProduct = await deleteProductServices(pid);
    const { products: productsEmit } = await getProductsServices(options);
    io.emit("refreshProducts", productsEmit);
    return res.sendSuccess("Product deleted succesfully");
  } catch (error) {
    return res.sendServerError(error.message);
  }
}

