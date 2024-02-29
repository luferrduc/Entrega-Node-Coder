import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { fakerES as faker } from "@faker-js/faker";
import configs from "./config.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const __mainDirname = join(__dirname, '..')

export const productsFilePath = join(__dirname, "./files/productos.json");
export const cartsFilePath = join(__dirname, "./files/carts.json");

// 1. Hashear nuestra password
export const createHash = (password) => {
	const salt = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	return salt;
};
// 2. Validar nuestra password
export const isValidPassowrd = (plainPassword, hashedPassword) => {
	const result = bcrypt.compareSync(plainPassword, hashedPassword);
	return result;
};

export const generateToken = (user, expires = "24h") => {
	// console.log({userToken: user})
	const token = jwt.sign({ user }, configs.privateKeyJWT, { expiresIn: expires });
	return token;
};

export const authorization = (role) => {
	return async (req, res, next) => {
		if (req.user.role !== role)
			return res
				.status(403)
				.send({ status: "error", message: "not permissions" });
		next();
	};
};

export const generateProducts = () => {
	const product = {
		_id: faker.database.mongodbObjectId(),
		title: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		price: faker.commerce.price(),
		thumbnail: faker.helpers.arrayElements([faker.image.url()]),
		code: faker.string.uuid(),
		stock: faker.number.int(1),
		status: faker.datatype.boolean(),
    category: faker.commerce.product()
	};
	return product;
};
