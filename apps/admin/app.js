module.exports = function (config, mongoose, context) {

	var bootstrap = require(config.paths.shared.utils + 'bootstrap'),
		express = require('express'),
		paths = config.paths,
		app = express();

	// // Express configuration
	// require(paths.app.config + 'express')(app, config, mongoose);

	// // Passport configuration
	// require(paths.app.config + 'passport')(config);

	// // Pull in app specific mongoose schema definitions
	// bootstrap.getAllModels(paths.app.models, config, mongoose, app, context);

	// // Dynamically pull in the app's controllers
	// bootstrap.getAllControllers(app, config, mongoose, context);
	
	return app;

};