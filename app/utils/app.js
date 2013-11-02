function utils () {

	var constants = require(app.get('paths').utils + 'constants'),
		utils = {};

	/*	
	 *	Format a view path into a commonly formatted page ID
	 *  view: Passed to the render function, 
	 */
	utils.getPageIdFromViewPath = function (path) {

		var pageId = path;

		if (pageId !== undefined) {
			// Remove relative path parts (../, ./, ./../, etc...)
			pageId = pageId.replace(/^(?:\.*?\/)+/, '');

			// Remove special characters, except further forward slashes (replaced later)
			pageId = pageId.replace(/[^\w\s\/]/gi, '');

			// Remove the last '/' character if it's at the end of the string
			pageId = pageId.replace(/\/$/, '');

			// Replace subsequent slashes with an underscore
			pageId = pageId.replace(/\//g, '_');
		}

		return pageId;
	};

	/*	
	 *	Returns a space delimited list of CSS classes defining the current page config
	 *  view: Passed to the render function, 
	 */
	utils.getHtmlBodyClasses = function (request, view) {

		var classes = utils.getPageIdFromViewPath(view);

		// @todo: check request for login status and send back relevant classname

		return classes;
	};

	/*	
	 *	Scope common variables to all templates
	 *  Page ID: Used to help a given template differentiate the original request route
	 *	Body Classes: Used for CSS styling on a per view basis
	 */
	utils.getCommonRouteData = function (view, locals, request, response) {
		
		if (locals === undefined) {
			locals = {};
		}

		locals.common = {};
		locals.common[constants.PAGE_ID] = utils.getPageIdFromViewPath(view);
		locals.common[constants.BODY_CLASSES] = utils.getHtmlBodyClasses(request, view);
		
		if (app.enabled('site')) {
			// site specific
		} else if (app.enabled('admin')) {
			// admin specific
		}

		return locals;
	};

	/*	
	 *	Renders the 500 error template
	 *
	 *	error - the error object
	 *  request - used to get the original request URL
	 *	response - used to render the 500 template
	 */
	utils.renderErrorPage = function (error, request, response, msg) {

		var status = (error.status || 500).toString();

		response.status(status);

		if (msg !== undefined) {
			error.msg = msg;
		}

		response.render(status, {
			page: constants.ERROR_PAGE_KEY,
			error: error
		});

		if (error.stack !== undefined) {
			console.error(error.stack);
		}

	};

	/*	
	 *	Remove a query string from a URL
	 *  url: the url to modify
	 */
	utils.removeQueryAndHashFromUrl = function (url) {

		url = url.split('?')[0].split('#')[0];

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
	utils.getAbsolutePath = function (path) {
		return app.get('paths').root + path;
	};

	/*	
	 *	Includes all .js files in a directory
	 *	path: the path to loop over .js files and include
	 *	moduleImportHook: a callback to fire each time a module is imported
	 */
	utils.requireAll = function (path, moduleImportHook) {
		
		var fs = require('fs'),
			includeFile;

		fs.readdirSync(path).forEach(function (file) {
			if (file.substr(-3) === '.js') {
				includeFile = require(path + file);
				if (typeof moduleImportHook === 'function') {
					moduleImportHook.call(includeFile, file);
				}
			}
		});

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

	/*	
	 *	Shorthand method for retrieving page param from request object
	 *	request: the request object containing the 'page' param (or not, fallback will be used)
	 */
	utils.getPageFromRequest = function (request) {
		return utils.getNumericQueryParam(request.query[constants.PAGE_PARAM], constants.DEFAULT_PAGE);
	};

	/*	
	 *	Shorthand method for retrieving results param from request object
	 *	request: the request object containing the 'results' param (or not, fallback will be used)
	 */
	utils.getResultsFromRequest = function (request) {
		return utils.getNumericQueryParam(request.query[constants.RESULTS_PARAM], constants.DEFAULT_RESULTS);
	};

	return utils;

};

module.exports = utils;