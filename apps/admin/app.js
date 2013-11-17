module.exports = function (config, mongoose, context) {

	var bootstrap = require(config.paths.shared.utils + 'bootstrap'),
		express = require('express'),
		paths = config.paths,
		app = express();

	// Express configuration
	require(paths.app.config + 'express')(app, config, mongoose);

	// Passport configuration
	require(paths.app.config + 'passport')(config);

	// Dynamically pull in the app's controllers
	bootstrap.getAllControllers(app, config, mongoose, context);
	
	return app;

};