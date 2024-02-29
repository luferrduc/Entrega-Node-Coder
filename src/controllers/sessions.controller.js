import { generateToken, createHash, isValidPassowrd } from "../utils.js";
import { validateUser } from "../schemas/users.schema.js";
import { login as loginServices } from "../services/sessions.services.js";
import { showPublicUser as showPublicUserServices } from "../services/sessions.services.js";
import { addCartToUser as addCartToUserServices } from "../services/sessions.services.js";
import { logout as logoutServices } from "../services/sessions.services.js";
import { register as registerServices } from "../services/sessions.services.js";
import { passwordLink as passwordLinkServices } from "../services/sessions.services.js";
import { updatePassword as updatePasswordServices} from "../services/sessions.services.js"
import { changeRoleUser as changeRoleUserServices } from "../services/sessions.services.js"
import { createCart as createCartServices } from "../services/carts.services.js";
import { PasswordIsNotValidError, UserNotFoundError } from "../utils/custom.exceptions.js";


export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.sendClientError("incomplete values");

		if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
			const userAdminCoder = {
				_id: 1,
				first_name: "Admin",
				last_name: "Coder",
				email,
				role: "admin"
			};
			const accessToken = generateToken(userAdminCoder);

			res.cookie("coderCookieToken", accessToken, {
				maxAge: 24 * 60 * 60 * 1000,
				httpOnly: true
			});
			return res.sendSuccess(accessToken);
		}
		let user = await loginServices(email);
		if (!user) return res.sendAuthError("incorrect credentials");

		const comparePassword = isValidPassowrd(password, user.password);

		if (!comparePassword) return res.sendAuthError("incorrect credentials");

		let cartId;

		if (!user.cart) {
			cartId = await createCartServices();
			user = await addCartToUserServices(user, cartId);
		}

		const publicUser = await showPublicUserServices(user);

		const accessToken = generateToken(publicUser);

		res.cookie("coderCookieToken", accessToken, {
			maxAge: 24 * 60 * 60 * 1000,
			httpOnly: true
		});
		return res.sendSuccess(accessToken);
	} catch (error) {
		req.logger.error(`${error.message}`);
		return res.sendServerError(error.message);
	}
};

export const register = async (req, res) => {
	try {
		const resultUser = validateUser(req.body);
		if (resultUser.error) return res.sendUnproccesableEntity(resultUser.error);
		const user = resultUser.data;

		const existsUser = await loginServices(user.email);
		if (existsUser) return res.sendClientError("user already exists");

		const registeredUser = await registerServices(user);
		return res.sendSuccessNewResource({ payload: registeredUser });
	} catch (error) {
		return res.sendServerError(error.message);
	}
};

export const logout = async (req, res) => {
	try {
		const result = await logoutServices(req.user.email);
		return res.clearCookie("coderCookieToken").redirect("/login");
	} catch (error) {
		req.logger.error(`${error.message}`);
	}
};

export const github = async (req, res) => {
	return res.send({ status: "success", message: "user registered" });
};

export const githubCallback = async (req, res) => {
	req.user = {
		first_name: req.user.first_name,
		last_name: req.user.last_name,
		email: req.user.email,
		age: req.user.age,
		role: req.user.role
	};
	return res.redirect("/products");
};

export const getCartByUser = async (req, res) => {
	try {
		const { cart: userCart } = req.user;
		const { _id: cid } = userCart;

		if (cid) return res.send({ status: "success", payload: { _id: cid } });
	} catch (error) {
		req.logger.error(`${error.message}`);
		return res.sendServerError(error.message);
	}
};

export const passwordLink = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await loginServices(email);
		if (user) {
			const newUser = {
				first_name: user.first_name,
				last_name: user.last_name,
				email
			};
			const token = generateToken(newUser, "1h");
			const result = await passwordLinkServices(newUser, token);
			if(!result.messageId){
				req.logger.error("Error al enviar email")
				return res.redirect("/login")
			}
			// TODO: retornar el response correspondiente
			return res.sendSuccess("Email was sent successfully")
		}
	} catch (error) {
		req.logger.error(`${error.message}`);
		return res.sendServerError(error.message);
	}
};

export const passwordChange = async (req, res) => {
	try {
		const data = req.body
		const { password, email } = data

		const user = await loginServices(email);
		if(!user){
			req.logger.error(`User with email ${user.email} doesn't exists`);
			return res.sendUnproccesableEntity(`User with email ${user.email} doesn't exists`)
		} 

		
		const newUser = await updatePasswordServices(email, user, password)
		if(!newUser){
			req.logger.error(`User with email ${user.email} doesn't exists`);
			return res.sendUnproccesableEntity(`Password cannot be changed`)
		}

		return res.sendSuccess('Password has been changed successfully')
	} catch (error) {
		console.log(error)
		if(error instanceof PasswordIsNotValidError){
			return res.sendUnproccesableEntity(error.message)
		}
		req.logger.fatal(`${error.message}`);
		return res.sendServerError(error.message);
	}
};

export const changeRoleUser = async (req, res) => {
	try {
		const { uid } = req.params
		const result = await changeRoleUserServices(uid)

		return res.sendSuccess(result)
	} catch (error) {
		if(error instanceof UserNotFoundError){
			req.logger.error(`${error.message}`);
			return res.sendClientError(error.message);
		}else{
			req.logger.fatal(`${error.message}`);
			return res.sendServerError(error.message)
		}
	}
}