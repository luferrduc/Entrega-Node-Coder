import { Router } from "express"
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js"
import { handlePoliciesViews } from "../middlewares/auth.js"
import { passportCallViews } from "../config/passport.config.js"
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
	passwordLinkView,
	usersView
} from "../controllers/views.controller.js"

const router = Router()

router
	.get(
		"/",
		passportCallViews(passportStrategiesEnum.JWT),
		handlePoliciesViews([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		profile
	)
	.get(
		"/realtimeproducts",
		passportCallViews(passportStrategiesEnum.JWT),
		handlePoliciesViews([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		realTimeProductsView
	)
	.get(
		"/products",
		passportCallViews(passportStrategiesEnum.JWT),
		handlePoliciesViews([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		productsView
	)
	.get(
		"/products/:pid",
		passportCallViews(passportStrategiesEnum.JWT),
		handlePoliciesViews([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		productDetail
	)
	.get(
		"/cart/detail",
		passportCallViews(passportStrategiesEnum.JWT),
		handlePoliciesViews([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		cartDetail
	)
	.get(
		"/chat",
		passportCallViews(passportStrategiesEnum.JWT),
		handlePoliciesViews([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		chat
	)
	.get(
		"/register",
		passportCallViews(passportStrategiesEnum.NOTHING),
		handlePoliciesViews([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		register
	)
	.get(
		"/login",
		passportCallViews(passportStrategiesEnum.NOTHING),
		handlePoliciesViews([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		login
	)
	.get(
		"/password-link",
		passportCallViews(passportStrategiesEnum.NOTHING),
		handlePoliciesViews([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		passwordLinkView
	)
	.get(
		"/reset-password",
		passportCallViews(passportStrategiesEnum.NOTHING),
		handlePoliciesViews([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		resetPasswordView
	)
	.get(
		"/users",
		passportCallViews(passportStrategiesEnum.JWT),
		handlePoliciesViews([accessRolesEnum.ADMIN]),
		generateCustomResponse,
		usersView
	)

export default router
