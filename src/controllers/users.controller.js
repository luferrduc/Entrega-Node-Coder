import {
	RequiredDocumentsNotFound,
	UserNotFoundError
} from "../utils/custom.exceptions.js"
import { changeRoleUser as changeRoleUserServices } from "../services/users.services.js"
import { uploadDocuments as uploadDocumentsServices } from "../services/users.services.js"
import { getUserById as getUserByIdServices } from "../services/users.services.js"
import { getAllUsers as getAllUsersServices } from "../services/users.services.js"
import { deleteInactiveUsers as deleteInactiveUsersServices } from "../services/users.services.js"

export const getAllUsers = async (req, res) => {
	try {
		const users = await getAllUsersServices()
		return res.sendSuccess(users)
	} catch (error) {
		req.logger.fatal(`${error.message}`)
		return res.sendServerError(error.message)
	}
}

export const changeRoleUser = async (req, res) => {
	try {
		const { uid } = req.params
		const result = await changeRoleUserServices(uid)

		return res.sendSuccess(result)
	} catch (error) {
		if (error instanceof UserNotFoundError) {
			req.logger.error(`${error.message}`)
			return res.sendClientError(error.message)
		} else if (error instanceof RequiredDocumentsNotFound) {
			req.logger.error(`${error.message}`)
			return res.sendUnproccesableEntity(error.message)
		} else {
			req.logger.fatal(`${error.message}`)
			return res.sendServerError(error.message)
		}
	}
}

export const getUserById = async (req, res) => {
	try {
		const { uid } = req.params
		const user = await getUserByIdServices(uid)
		return res.sendSuccess(user)
	} catch (error) {
		if (error instanceof UserNotFoundError) {
			req.logger.error(`${error.message}`)
			return res.sendNotFoundError(error.message)
		} else {
			req.logger.fatal(`${error.message}`)
			return res.sendServerError(error.message)
		}
	}
}

export const uploadDocuments = async (req, res) => {
	try {
		const files = req.files
		const { uid } = req.params
		const user = await getUserByIdServices(uid)

		const result = await uploadDocumentsServices(user, files)
		return res.sendSuccess(result)
	} catch (error) {
		if (error instanceof UserNotFoundError) {
			req.logger.error(`${error.message}`)
			return res.sendNotFoundError(error.message)
		} else {
			req.logger.fatal(`${error.message}`)
			return res.sendServerError(error.message)
		}
	}
}

export const deleteOneUser = async (req, res) => {}

export const deleteInactiveUsers = async (req, res) => {
	try {
		const inactiveUsers = await deleteInactiveUsersServices()
		return res.sendSuccess(inactiveUsers)
	} catch (error) {
		req.logger.fatal(`${error.message}`)
		return res.sendServerError(error.message)
	}
}
