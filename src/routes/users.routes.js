import { Router } from "express"
import { handlePolicies } from "../middlewares/auth.js"
import { passportCall } from "../config/passport.config.js"
import { generateCustomResponse } from "../middlewares/responses.js"
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js"
import {
	changeRoleUser,
	uploadDocuments,
	getAllUsers,
	getUserById,
	deleteInactiveUsers
} from "../controllers/users.controller.js"
import uploader from "../middlewares/uploader.js"

const router = Router()

router
	.get(
		"/",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([
			accessRolesEnum.USER,
			accessRolesEnum.PREMIUM,
			accessRolesEnum.ADMIN
		]),
		generateCustomResponse,
		getAllUsers
	)
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
	.delete(
		"/",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([
			accessRolesEnum.ADMIN,
			accessRolesEnum.USER,
		]),
		generateCustomResponse,
		deleteInactiveUsers
	)
	.delete(
		"/:email",
		passportCall(passportStrategiesEnum.JWT),
		handlePolicies([
			accessRolesEnum.ADMIN
		])
	)

export default router