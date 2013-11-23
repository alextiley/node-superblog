module.exports = function (app, config) {

	var path = require('path'),
		express = require('express'),
		passport = require('passport'),
		flash = require('connect-flash'),
		mongoStore = require('connect-mongo')(express),
		urlUtils = require(path.join(config.paths.shared.utils, 'url')),
		constants = require(path.join(config.paths.shared.utils, 'constants')),
		expressUtils = require(path.join(config.paths.shared.utils, 'express')),
		renderOverride = require(path.join(config.paths.shared.middleware, 'renderOverride'));

	// Development-specific configuration
	app.configure('development', function () {
		// Development logging
		app.use(express.logger('dev'));
		// Pretty print HTML output
		app.locals.pretty = true;
	});

	// Set .jade as the default template extension
	app.set('view engine', 'jade');

	// Enable flash message middleware
	app.use(flash());

	// Set the assets path
	app.use(express.static(config.paths.app.assets));

	// Set the base directory
	app.use(function (request, response, next) {
		app.locals.basedir = config.paths.app.views;
		next();
	});

	// Sets the favicon path (default is an express favicon)
	app.use(express.favicon(path.join(config.paths.app.assets, 'img/favicon.ico')));

	// Set the base view path
	app.use(function (request, response, next) {
		app.set('views', config.paths.app.views);
		next();
	});

	// Parse and populate cookie data to request.cookies
	app.use(express.cookieParser());

	// Automatically parse request bodies (scopes post data to request.body)
	app.use(express.json());
	app.use(express.urlencoded());

	// Allow HTTP method overrides (using _method hidden input)
	app.use(express.methodOverride());

	// Provides cookie-based sessions with mongo storage
	app.use(express.session({
		secret: config.cookies.secret,
		store: new mongoStore ({
			url: config.db.url
		})
	}));

	// Enable passport authentication
	app.use(passport.initialize());
	app.use(passport.session());

	// Handle user authentication
	app.use(function (request, response, next) {
		require(path.join(config.paths.app.middleware, 'authentication'))(request, response, next, config);
	});

	// Include common view data, invoked on all route requests
	app.use(renderOverride.requests(config));

	// Allows mounting of roots
	app.use(app.router);

	// Page not found (404)
	// ---- next() will trigger a 404 as no routes match after this
	app.get('/404', function (request, response, next) {
		next();
	});

	// Access denied (403)
	app.get('/403', function (request, response, next) {
		var error = new Error('Access denied!');
		error.status = 403;
		next(error);
	});

	// Internal server error (500)
	app.get('/500', function (request, response, next) {
		var error = new Error('You\'ve requested the error page. Doh!');
		error.status = 500;
		next(error);
	});

	// Route 404's to a proper template (no route found in app.router)
	// This is the last non-error-handling middleware use()d,
	// therefore assume 404 as none of the others responded
	app.use(function(request, response, next) {

		response.status(404);

		if (request.accepts('html')) {
			response.render('404', {
				url: urlUtils.getAbsoluteUrl(request),
				page: constants.NOT_FOUND_PAGE_KEY,
				method: request.method
			});
		} else if (request.accepts('json')) {
			response.send({
				error: 'Not found'
			});
		} else {
			response.type('txt').send('Not found');
		}

	});

	// Middleware to call when errors are present
	app.use(function(error, request, response, next) {
		renderOverride.errors(error, request, response, config);
		expressUtils.renderErrorPage(error, request, response, config);
	});

	return app;
};