module.exports = function (config, mongoose, context) {

	var bootstrap = require(config.paths.shared.utils + 'bootstrap'),
		express = require('express'),
		paths = config.paths,
		app = express();

	// Pull in app specific mongoose schema definitions
	bootstrap.getAllModels(paths.app.models, config, mongoose, app, context);

	// Express configuration
	require(paths.app.config + 'express')(app, config, mongoose);

	// Passport configuration
	require(paths.app.config + 'passport')(config, mongoose);

	// Dynamically pull in the app's controllers
	bootstrap.getAllControllers(app, config, mongoose, context);
	
	return app;
};