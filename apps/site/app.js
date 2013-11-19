module.exports = function (config, mongoose) {

	var bootstrap = require(config.paths.shared.utils + 'bootstrap'),
		express = require('express'),
		paths = config.paths,
		app = express();

	// Pull in app specific mongoose schema definitions
	mongoose = bootstrap.getAllModels(paths.app.models, config, mongoose, app);

	// Express configuration
	app = require(paths.app.config + 'express')(app, config, mongoose);

	// Dynamically pull in the app's controllers
	app = bootstrap.getAllControllers(app, config, mongoose);
	
	return app;
};