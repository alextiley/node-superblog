var validators = {};

// Something already exists...
validators.unique = function (value) {
	return false; // somehow need to work out what type of field this was...
};

// Please enter a valid username. Usernames must be between 3 - 20 characters and can contain alphanumberic characters, underscores and hyphens.
validators.username = function (value) {
	return value.match(/^[a-zA-Z0-9-_]{3,20}$/);
};

// Please enter a valid password. Valid passwords should contain at least 8 characters, contain at least one uppercase letter, one lowercase letter, one number and at least one special character.
validators.password = function (value) {
	return value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@£\$%\^&\*\(\)])[0-9a-zA-Z!@£\$%\^&\*\(\)]{8,}$/);
};

// Please enter a valid e-mail address
validators.email = function (value) {
	return value.match(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/);
};

module.exports = validators;