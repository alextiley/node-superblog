module.exports = function (config) {

	var urlUtils = require(config.paths.shared.utils + 'url'),
		utils = {};
	
	/*	
	 *	Shorthand method for retrieving page param from request object
	 *	request: the request object containing the 'page' param (or not, fallback will be used)
	 */
	utils.getPageFromRequest = function (request) {
		return urlUtils.getNumericQueryParam(request.query[constants.PAGE_PARAM], constants.DEFAULT_PAGE);
	};

	/*	
	 *	Shorthand method for retrieving results param from request object
	 *	request: the request object containing the 'results' param (or not, fallback will be used)
	 */
	utils.getResultsFromRequest = function (request) {
		return urlUtils.getNumericQueryParam(request.query[constants.RESULTS_PARAM], constants.DEFAULT_RESULTS);
	};

	return utils;

};