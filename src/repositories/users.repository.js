import UsersDto from "../DTOs/users.dto.js";

export default class UsersRepository {
	constructor(dao) {
		this.dao = dao;
	}

	login = async (email) => {
		const user = await this.dao.getByEmail(email);
		return user;
	};

  showPublicUser = async (user) => {
    const finalUser = new UsersDto(user)
    return finalUser
  }

	addCartToUser = async (user, cartId) => {
		
		const result = await this.dao.addCartToUser(user, cartId)
		return result
	}

	register = async (newUser) => {
		const result = await this.dao.create(newUser);
		return result;
	};

	logout = async (email) => {
		const result = await this.dao.deleteCartFromUser(email);
		return result;
	};
}
