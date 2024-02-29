import { Router } from "express";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { handlePolicies } from "../middlewares/auth.js";
import { passportCall } from "../config/passport.config.js";
import { generateCustomResponse } from "../middlewares/responses.js";
import {
	cartDetail,
	chat,
	login,
	productDetail,
	productsView,
	profile,
	realTimeProductsView,
	register,
	resetPasswordView,
	passwordLinkView
} from "../controllers/views.controller.js";

const router = Router();

router
	.get(
		"/",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		profile
	)
	.get(
		"/realtimeproducts",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		realTimeProductsView
	)
	.get(
		"/products",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		productsView
	)
	.get(
		"/products/:pid",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		productDetail
	)
	.get(
		"/cart/detail",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		cartDetail
	)
	.get(
		"/chat",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		chat
	)
	.get(
		"/register",
		passportCall(passportStrategiesEnum.NOTHING),
		handlePolicies([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		register
	)
	.get(
		"/login",
		passportCall(passportStrategiesEnum.NOTHING),
		handlePolicies([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		login
	)
	.get(
		"/password-link",
		passportCall(passportStrategiesEnum.NOTHING),
		handlePolicies([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		passwordLinkView
	)
	.get(
		"/reset-password",
		passportCall(passportStrategiesEnum.NOTHING),
		handlePolicies([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		resetPasswordView
	);

export default router;
