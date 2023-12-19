export const generateCustomResponse = (req, res, next) => {
  res.sendSuccess = (data) => {
    return res.status(200).json({ status: "success", payload: data });
  };
  res.sendSuccessNewResource = (data) => {
    return res.status(201).json({ status: "success", ...data });
  };
  res.sendClientError = (error) => {
    return res.status(400).json({ status: "error", message: error });
  };
  res.sendAuthError = (error) => {
    return res.status(401).json({ status: "error", message: error });
  };
  res.sendPermissionsError = (error) => {
    return res.status(403).json({ status: "error", message: error });
  };
  res.sendNotFoundError = (error) => {
    return res.status(404).json({ status: "error", message: error });
  }
  res.sendUnproccesableEntity = (error) => {
    return res.status(422).json({ status: "error", message: error })
  }
  res.sendServerError = (error) => {
    return res.status(500).json({ status: "error", message: error });
  };
  next();
};
