var utils = require(app.get('paths').utils + 'app')(),
	overrideRenderMiddleware;

// This method overrides the default render method, allowing
// you to add additional data to all requests if required

overrideRenderMiddleware = function (request, response, error) {

	var render = response.render;

	response.render = function (view, locals, callback) {
		locals = utils.getCommonRouteData(view, locals, request, response);
		render.call(response, view, locals, callback);
	};

};

module.exports.overrideRender = function () {
	return function (request, response, next) {
		overrideRenderMiddleware(request, response);
		next();
	};
};

module.exports.overrideErrorRender = function (error, request, response) {
	overrideRenderMiddleware(request, response, error);
};