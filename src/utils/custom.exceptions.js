// Errores acerca de usuario
export class UserAlreadyExistsError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class UserNotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class PasswordIsNotValidError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class RequiredDocumentsNotFound extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class ResourceNotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class RoutingError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class InvalidCredentialsError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class NotPermissionsError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class InvalidTypeError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class MissingValuesError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class InvalidOwnerError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class DatabaseError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}
