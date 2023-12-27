// import Users from "../dao/dbManagers/users.manager.js";
import { Users as UsersDao } from "../dao/factory.js"
import UsersRepository from "../repositories/users.repository.js"
import { createHash, isValidPassowrd } from "../utils.js";

const usersDao = new UsersDao()
const userRepository = new UsersRepository(usersDao)

export const login = async (email) => {
  const user = await userRepository.login(email)
  return user
}

export const showPublicUser = async (user) => {
  const publicUser = await userRepository.showPublicUser(user)
  return publicUser
}

export const addCartToUser = async (user, cartId) => {
  const newUser = await userRepository.addCartToUser(user, cartId)
  return newUser
}

export const register = async (user) => {
  const hashedPassword = createHash(user.password);
  const newUser = { ...user };
  newUser.password = hashedPassword;
  const result = await userRepository.register(newUser);
  return result
}

export const logout = async (email) => {
  const result = await userRepository.logout(email);
  return result
}

