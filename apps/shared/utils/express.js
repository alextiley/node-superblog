module.exports = function () {

	var utils = {};

	/*
	 *	Renders the 500 error template
	 *
	 *	error - the error object
	 *  request - used to get the original request URL
	 *	response - used to render the 500 template
	 */
	utils.renderErrorPage = function (error, request, response, config) {

		var constants = require(config.paths.shared.utils + 'constants'),
			status = (error.status || 500).toString();

		response.status(status);

		response.render(status, {
			error: error
		});
		
		if (error.stack !== undefined) {
			console.error(error.stack);
		}

	};

	return utils;
}();