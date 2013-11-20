module.exports = function (config, mongoose, context) {

	var bootstrap = require(config.paths.shared.utils + 'bootstrap'),
		express = require('express'),
		paths = config.paths,
		app = express();

	// Pull in app specific mongoose schema definitions
	mongoose = bootstrap.getModels(paths.app.models, config, mongoose, app);

	// Express configuration
	app = require(paths.app.config + 'express')(app, config, mongoose);

	// Passport configuration
	require(paths.app.config + 'passport')(config, mongoose);

	// Dynamically pull in the app's controllers
	app = bootstrap.getControllers(app, config, mongoose, context);
	
	return app;
};