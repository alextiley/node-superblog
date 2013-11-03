module.exports = function () {

	var express = require('express'),
		mongoStore = require('connect-mongo')(express),
		utils = require(app.get('paths').utils + 'app')(),
		pkg = require(app.get('paths').root + 'package.json'),
		constants = require(app.get('paths').utils + 'constants');

	// Development-specific configuration
	app.configure('development', function () {
		// Development logging
		app.use(express.logger('dev'));
		// Pretty print HTML output
		app.locals.pretty = true;
	});

	// Configure the current context (site or admin)
	app.use(function (request, response, next) {
		if (/(^\/admin)(\/)?/.test(request.url)) {
			app.enable('admin');
			app.disable('site');
		} else {
			app.enable('site');
			app.disable('admin');
		}
		next();
	});

	// Set .jade as the default template extension
	app.set('view engine', 'jade');

	// Set the site's base directory
	app.use('/', function (request, response, next) {
		app.locals.basedir = app.get('paths').site.views;
		next();
	});

	// Set the admin base directory
	app.use('/admin', function (request, response, next) {
		app.locals.basedir = app.get('paths').views;
		next();
	});

	// Expose package.json to views
	app.use(function (request, response, next) {
		app.locals.pkg = pkg;
		next();
	});

	// Sets the favicon path (default is an express favicon)
	app.use('/', express.favicon(app.get('paths').site.assets + 'img/favicon.ico'));
	app.use('/admin', express.favicon(app.get('paths').assets + 'img/favicon.ico'));

	// Set the base view path
	app.use('/', function (request, response, next) {
		app.set('views', app.get('paths').site.views);
		next();
	});

	// Set the base view path
	app.use('/admin', function (request, response, next) {
		app.set('views', app.get('paths').views);
		next();
	});

	// Automatically parse request bodies
	app.use(express.bodyParser());
	
	// Allow HTTP method overrides (using _method hidden input)
	app.use(express.methodOverride());

	// Parse and populate cookie data to request.cookies
	app.use(express.cookieParser());

	// Provides cookie-based sessions with mongo storage
	app.use(express.session({
		secret: app.get('cookies').secret,
		store: new mongoStore ({
			url: app.get('db').url
		})
	}));

	// Passport authentication module
	require(app.get('paths').config + 'passport')();
	
	app.use(passport.initialize());
	app.use(passport.session());

	// Set the assets path
	app.use('/site', express.static(app.get('paths').site.assets));
	app.use('/admin', express.static(app.get('paths').assets));

	// Include common view data, invoked on all route requests
	app.use(function (request, response, next) {
		
		var render = response.render;
		
		response.render = function (view, locals, callback) {
			locals = utils.getCommonRouteData(view, locals, request, response);
			render.call(response, view, locals, callback);
		};

		next();
	});

	// Allows mounting of roots
	app.use(app.router);

	// Page not found (404)
	// ---- next() will trigger a 404 as no routes match after this
	app.get(/^\/(admin\/)?404(\/)?$/, function (request, response, next) {
		next();
	});

	// Access denied (403)
	app.get(/^\/(admin\/)?403(\/)?$/, function (request, response, next) {
		var error = new Error('Access denied!');
		error.status = 403;
		next(error);
	});

	// Internal server error (500)
	app.get(/^\/(admin\/)?500(\/)?$/, function (request, response, next) {
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
				url: utils.getAbsoluteUrl(request),
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
		utils.renderErrorPage(error, request, response);
	});

};