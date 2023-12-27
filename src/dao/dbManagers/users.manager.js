import usersModel from "./models/users.model.js";

export default class Users {
	constructor() {}
	getAll = async () => {
		const users = await usersModel.find().lean();
		return users;
	};
	getOne = async (userParams) => {
		const exists = await usersModel.findOne(userParams).lean();
		return exists;
	};

	getByEmail = async (email) => {
		const exists = await usersModel.findOne({ email }).lean();
		return exists;
	};

	create = async ({ first_name, last_name, email, age, password }) => {
		const result = await usersModel.create({
			first_name,
			last_name,
			email,
			age,
			password
		});
		return result;
	};

	addCartToUser = async (user, cartId) => {
		const email = user.email;
		const newUser = await usersModel.findOneAndUpdate({ email }, { cart: cartId });
		const userUpdated = await usersModel.findOne({email}).lean()
		return userUpdated
	};

	deleteCartFromUser = async (email) => {
		const user = await usersModel.findOne({ email }).lean();
		if (user?.cart) {
			delete user?.cart;
			usersModel.findOneAndUpdate({ email }, user);
		}
		return user;
	};
}
