// import Users from "../dao/dbManagers/users.manager.js";
import { Users as UsersDao } from "../dao/factory.js"
import UsersRepository from "../repositories/users.repository.js"
import { createHash, isValidPassowrd } from "../utils.js";
import { sendEmail } from "./mail.services.js";
import { resetPasswordEmail } from "../utils/custom.html.js";
import { PasswordIsNotValidError, UserNotFoundError } from "../utils/custom.exceptions.js";

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

export const passwordLink = async (user, token) => {

  const html = resetPasswordEmail(`${user.first_name} ${user.last_name}`, token)
  const email = {
    to: user.email,
    subject: "Password Reset Link",
    html
  }
  // TODO: Retornar respuesta del envio del email
  const sentMail = await sendEmail(email)
  return sentMail
}

export const updatePassword = async (email, user, newPassword) => {

  const { password } = user
  const isValid = isValidPassowrd(newPassword, password)
  
  if(!isValid) throw new PasswordIsNotValidError("You must use a password different from the previous one")

  const newHashedPassword = createHash(newPassword)
  const result = await userRepository.updatePassword(email, newHashedPassword)

  return result
}


export const changeRoleUser = async (uid) => {
  let result
  const user = await userRepository.getById(uid)
  if(!user) throw new UserNotFoundError("User not found, incorrect id")
  if(user.role === "user"){
    result = await userRepository.changeRole(uid, "premium")
  } else if (user.role === "premium"){
    result = await userRepository.changeRole(uid, "user")
  }
  
  return result

}