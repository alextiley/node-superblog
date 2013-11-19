
// This method overrides the default render method, allowing
// the addition of common data to all response objects

var self = {};

/*
 *	Format a view path into a commonly formatted page ID
 *	view: Passed to the render function, 
 */
self.getPageIdFromViewPath = function (path) {

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
 *	view: Passed to the render function, 
 */
self.getHtmlBodyClasses = function (request, view) {

	var classes = self.getPageIdFromViewPath(view);

	// Todo: output role name when multiple roles exist
	classes += request.isAuthenticated() ? ' logged_in' : '';

	return classes;
};

/*
 *	Scope common variables to all templates
 *	Page ID: Used to help a given template differentiate the original request route
 *	Body Classes: Used for CSS styling on a per view basis
 */
self.getCommonRouteData = function (view, locals, request, response, config) {

	var constants = require(config.paths.shared.utils + 'constants');

	if (locals === undefined) {
		locals = {};
	}

	locals.common = {};
	locals.common[constants.PAGE_ID] = self.getPageIdFromViewPath(view);
	locals.common[constants.BODY_CLASSES] = self.getHtmlBodyClasses(request, view);

	if (request.flash) {
		locals.messages = {
			success: request.flash(constants.FLASH_SUCCESS),
			errors: request.flash(constants.FLASH_ERROR),
			warning: request.flash(constants.FLASH_WARNING),
			info: request.flash(constants.FLASH_INFO)
		};
	}

	return locals;
};

self.overrideRender = function (request, response, config, error) {
	console.log(config.paths);
	var render = response.render;

	response.render = function (view, locals, callback) {
		locals = self.getCommonRouteData(view, locals, request, response, config);
		render.call(response, view, locals, callback);
	};

};

module.exports.requests = function (config) {
	return function (request, response, next) {
		self.overrideRender(request, response, config);
		next();
	};
};

module.exports.errors = function (error, request, response, config) {
	self.overrideRender(request, response, config, error);
};