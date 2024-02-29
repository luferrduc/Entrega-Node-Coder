import { Router } from "express";
import toAsyncRouter from "async-express-decorator"
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

const router = toAsyncRouter(Router());

router
	.get(
		"/",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		getProducts
	)
	.get(
		"/mockingproducts",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		mockingProducts
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
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM]),
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
