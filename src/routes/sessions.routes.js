import { Router } from "express";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import passport from "passport";
import { handlePolicies } from "../middlewares/auth.js";
import { passportCall } from "../config/passport.config.js";
import { generateCustomResponse } from "../middlewares/responses.js";
import {
	login,
	github,
	githubCallback,
	logout,
	register,
	getCartByUser
} from "../controllers/sessions.controller.js";

const router = Router();

router
	.post(
		"/login",
		passportCall(passportStrategiesEnum.NOTHING),
		handlePolicies([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		login
	)
	.post(
		"/register",
		passportCall(passportStrategiesEnum.NOTHING),
		handlePolicies([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		register
	)
	.get(
		"/logout",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER, accessRolesEnum.ADMIN]),
		generateCustomResponse,
		logout
	)
	.get(
		"/github",
		passportCall(passportStrategiesEnum.GITHUB),
		handlePolicies([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		passport.authenticate("github", { scope: ["user:email"] }),
		github
	)
	.get(
		"/github-callback",
		passportCall(passportStrategiesEnum.GITHUB),
		handlePolicies([accessRolesEnum.PUBLIC]),
		generateCustomResponse,
		passport.authenticate("github", { failureRedirect: "/login" }),
		githubCallback
	)
	.get(
		"/user-cart",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([accessRolesEnum.USER]),
		generateCustomResponse,
		getCartByUser
	);

export default router;
