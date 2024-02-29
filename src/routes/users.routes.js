import { Router } from "express"
import { handlePolicies } from "../middlewares/auth.js"
import { passportCall } from "../config/passport.config.js"
import { generateCustomResponse } from "../middlewares/responses.js"
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js"
import { changeRoleUser, uploadDocuments } from "../controllers/users.controller.js"
import { getUserById } from "../controllers/users.controller.js"
import uploader from "../middlewares/uploader.js"

const router = Router()

router
	.get(
		"/:uid",
		passportCall(passportStrategiesEnum.NOTHING),
		handlePolicies([
			accessRolesEnum.PUBLIC,
			accessRolesEnum.PREMIUM,
			accessRolesEnum.ADMIN
		]),
		generateCustomResponse,
		getUserById
	)
	.post(
		"/:uid/documents",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([
			accessRolesEnum.USER,
			accessRolesEnum.PREMIUM,
			accessRolesEnum.ADMIN
		]),
		uploader.fields([
			{ name: "perfil" },
			{ name: "identificacion" },
			{ name: "productos" },
			{ name: "domicilio" },
			{ name: "cuenta" }
		]),
		generateCustomResponse,
		uploadDocuments
	)
	.put(
		"/premium/:uid",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([
			accessRolesEnum.USER,
			accessRolesEnum.PREMIUM,
			accessRolesEnum.ADMIN
		]),
		generateCustomResponse,
		changeRoleUser
	)

export default router
