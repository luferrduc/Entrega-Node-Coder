import Users from "../dao/dbManagers/users.manager.js";
import { createHash, isValidPassowrd } from "../utils.js";

const usersManager = new Users()

export const login = async (email) => {
  const user = await usersManager.getByEmail(email)
  return user
}

export const register = async (user) => {


  const hashedPassword = createHash(user.password);
  const newUser = { ...user };
  newUser.password = hashedPassword;
  const result = await usersManager.create(newUser);
  return result
}

export const logout = async (email) => {
  const result = await usersManager.deleteCartFromUser(email);
  return result
}

