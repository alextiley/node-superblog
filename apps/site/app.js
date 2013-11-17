module.exports = function (config, mongoose, context) {

	var bootstrap = require(config.paths.shared.utils + 'bootstrap'),
		express = require('express'),
		paths = config.paths,
		app = express();

	// Express configuration
	//require(_sitePath.config + 'express')();

	// Passport configuration
	//require(app.get('paths').config + 'passport')();

	// Dynamically pull in the app's controllers
	//bootstrap.getAllControllers(site, mongoose, context);
	return app;

};