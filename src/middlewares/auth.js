import { accessRolesEnum } from "../config/enums.js";

// Valdiador de autenticación
export const handlePolicies = (policies) => (req, res, next) => {
  if (policies[0] === accessRolesEnum.PUBLIC) return next();
  const user = req.user;
  if (!policies.includes(user?.role.toLowerCase()))
    return res
      .status(403)
      .json({ status: "error", message: "not permissions" });

  next();
};