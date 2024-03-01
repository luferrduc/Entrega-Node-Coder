import { Router } from "express"
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js"
import { handlePolicies } from "../middlewares/auth.js"
import { passportCall, passportCallViews } from "../config/passport.config.js"
import { generateCustomResponse } from "../middlewares/responses.js"
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
} from "../controllers/views.controller.js"

const router = Router()

router
	.get(
		"/",
		passportCallViews(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		profile
	)
	.get(
		"/realtimeproducts",
		passportCallViews(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		realTimeProductsView
	)
	.get(
		"/products",
		passportCallViews(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		productsView
	)
	.get(
		"/products/:pid",
		passportCallViews(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		productDetail
	)
	.get(
		"/cart/detail",
		passportCallViews(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		cartDetail
	)
	.get(
		"/chat",
		passportCallViews(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		chat
	)
	.get(
		"/register",
		passportCallViews(passportStrategiesEnum.NOTHING),
		handlePolicies([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		register
	)
	.get(
		"/login",
		passportCallViews(passportStrategiesEnum.NOTHING),
		handlePolicies([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		login
	)
	.get(
		"/password-link",
		passportCallViews(passportStrategiesEnum.NOTHING),
		handlePolicies([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		passwordLinkView
	)
	.get(
		"/reset-password",
		passportCallViews(passportStrategiesEnum.NOTHING),
		handlePolicies([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		resetPasswordView
	)
	.get(
		"/users",
		passportCallViews(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.ADMIN]),
		generateCustomResponse
	)

export default router
