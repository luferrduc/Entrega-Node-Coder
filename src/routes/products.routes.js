import { Router } from "express";
// import Router from "./router.js";
// import ProductManager from "../dao/fileManagers/product-file.manager.js";
import Products from "../dao/dbManagers/products.manager.js";
import { validateProduct } from "../schemas/products.schema.js";
import { productsFilePath } from "../utils.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { handlePolicies } from "../middlewares/auth.js";
import { passportCall } from "../config/passport.config.js";
import { generateCustomResponse } from "../middlewares/responses.js";
import {
	createProduct,
	deleteProduct,
	getProduct,
	getProducts,
	updateProduct
} from "../controllers/products.controller.js";

const router = Router();

router
	.get(
		"/",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		getProducts
	)
	.get(
		"/:pid",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		getProduct
	)
	.post(
		"/",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		createProduct
	)
	.put(
		"/:pid",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		updateProduct
	)
	.delete(
		"/:pid",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		deleteProduct
	);

export default router;
