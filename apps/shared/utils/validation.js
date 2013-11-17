module.exports = function () {

	var utils = {};

	/*
	 *	Scopes flash error messages to the request object
	 *
	 *	request: the request object to push the messages into
	 *	mongooseError: the error object returned from mongoose
	 */
	utils.getMongooseFlashErrors = function (request, mongooseError) {

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
	
	return utils;

}();