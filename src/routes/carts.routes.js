import { Router } from "express";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { handlePolicies } from "../middlewares/auth.js";
import { passportCall } from "../config/passport.config.js";
import { generateCustomResponse } from "../middlewares/responses.js";
import {
	addProduct,
	createCart,
	deleteCartProducts,
	deleteProduct,
	getCart,
	updateCart,
	updateProducts,
	purchaseProducts
} from "../controllers/carts.controller.js";

const router = Router();

router
	.get(
		"/:cid",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		getCart
	)
	.post(
		"/",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		createCart
	)
	.post(
		"/:cid/products/:pid",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		addProduct
	)
	.post(
		"/:cid/purchase",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		purchaseProducts
	)
	.put(
		"/:cid",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		updateCart
	)
	.put(
		"/:cid/products/:pid",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		updateProducts
	)
	.delete(
		"/:cid/products/:pid",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		deleteProduct
	)
	.delete(
		"/:cid",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		deleteCartProducts
	);

export default router;
