import EnumErrors from "./enums.js";

export default (error, req, res, next) => {
	switch (error.code) {
		case EnumErrors.INVALID_TYPE_ERROR:
			return res.status(400).send({
				status: "error",
				error: error.name,
				description: error.cause
			});
		case EnumErrors.MISSING_VALUE:
			return res.status(400).send({
				status: "error",
				error: error.name,
				description: error.cause
			});
		case EnumErrors.INVALID_CREDENTIALS:
			return res.status(401).send({
				status: "error",
				error: error.name,
				description: error.cause
			});
		case EnumErrors.NOT_PERMISSIONS:
			return res.status(403).send({
				status: "error",
				error: error.name,
				description: error.cause
			});
		case EnumErrors.RESORUCE_NOT_FOUND:
			return res.status(404).send({
				status: "error",
				error: error.name,
				description: error.cause
			});

		case EnumErrors.DATABASE_ERROR:
			return res.status(500).send({
				status: "error",
				error: error.name,
				description: error.cause
			});
		default:
			return res.status(500).send({
				status: "error",
				error: error.name,
				description: error.cause
			});
	}
	next();
};
