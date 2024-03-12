import { Router } from "express";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { handlePolicies } from "../middlewares/auth.js";
import { passportCall } from "../config/passport.config.js";
import { generateCustomResponse } from "../middlewares/responses.js";
import {
	createProduct,
	deleteProduct,
	getProduct,
	getProducts,
	updateProduct,
	mockingProducts
} from "../controllers/products.controller.js";

const router = Router();

router
	.get(
		"/",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		getProducts
	)
	.get(
		"/mockingproducts",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		mockingProducts
	)
	.get(
		"/:pid",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		getProduct
	)
	.post(
		"/",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		createProduct
	)
	.put(
		"/:pid",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		updateProduct
	)
	.delete(
		"/:pid",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		deleteProduct
	);

export default router;
