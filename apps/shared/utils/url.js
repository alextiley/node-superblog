module.exports = function () {

	var utils = {};

	/*
	 *  Remove a query string from a URL
	 *  url: the url to modify
	 */
	utils.removeQueryAndHashFromUrl = function (url) {
		if (url.indexOf('?') > -1) {
			url = url.split('?')[0];
		}
		if (url.indexOf('#') > -1) {
			url = url.split('#')[0];
		}
		return url;
	};

	/*
	 *	Get a relative URL from a request object
	 *  request: the request object
	 *	query [Boolean]: include the query string to the URL?
	 */
	utils.getRelativeUrl = function (request, query) {
			
		var relativeUrl,
			requestUrl;

		// Default setting: always include the query string
		query = query !== false;

		if (query) {
			relativeUrl = request.originalUrl;
		} else {
			requestUrl = require('url').parse(request.originalUrl);
			relativeUrl = requestUrl.pathname;
		}

		return relativeUrl;
	};

	/*
	 *	Get the current absolute URL
	 *  request: the request object
	 */
	utils.getAbsoluteUrl = function (request, query) {
		return request.protocol + '://' + request.get('host') + utils.getRelativeUrl(request, query);
	};

	/*
	 *	Get the current absolute directory path
	 *	path: the path to make absolute
	 */
	utils.getAbsolutePath = function (path, config) {
		return config.paths.app.root + path;
	};

	/*
	 *	Get a numeric request parameter and validate, fallback to a default
	 *	param: the parameter to validate
	 *	defaultValue: if param is NaN, use this value as a fallback
	 */
	utils.getNumericQueryParam = function (param, defaultValue) {

		var value = defaultValue;

		if (!isNaN(param)) {
			value = parseInt(param);
		}

		return value;
	};

	return utils;

}();