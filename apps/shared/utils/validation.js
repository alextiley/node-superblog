module.exports = function () {

	var validation = {};

	validation.utils = {};
	validation.validators = {};

	/*
	 *	Scopes flash error messages to the request object
	 *
	 *	request: the request object to push the messages into
	 *	mongooseError: the error object returned from mongoose
	 */
	validation.utils.getMongooseFlashErrors = function (request, mongooseError) {

		var fields = mongooseError.errors,
			errorMessages = [],
			validationType;

		for (field in fields) {
			if (fields.hasOwnProperty(field)) {
				validationType = fields[field].type === 'required' ? 'required' : 'format';
				errorMessages.push('i18n.errors.' + validationType + '.' + fields[field].path);
			}
		}

		return errorMessages;
	};

	// Something already exists...
	validation.validators.unique = function (value) {
		return false; // somehow need to work out what type of field this was...
	};

	// Please enter a valid username. Usernames must be between 3 - 20 characters and can contain alphanumberic characters, underscores and hyphens.
	validation.validators.username = function (value) {
		return value.match(/^[a-zA-Z0-9-_]{3,20}$/);
	};

	// Please enter a valid password. Valid passwords should contain at least 8 characters, contain at least one uppercase letter, one lowercase letter, one number and at least one special character.
	validation.validators.password = function (value) {
		return value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@£\$%\^&\*\(\)])[0-9a-zA-Z!@£\$%\^&\*\(\)]{8,}$/);
	};

	// Please enter a valid e-mail address
	validation.validators.email = function (value) {
		return value.match(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/);
	};
	
	return validation;

}();