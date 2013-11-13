var validators = {};

// Usernames must be between 3 - 20 characters and can contain alphanumberic characters, underscores and hyphens.
validators.username = function (value) {
	return value.match(/^[a-zA-Z0-9-_]{3,20}$/);
};

module.exports = validators;