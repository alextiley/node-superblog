module.exports = function (config) {

	var bootstrap = require(config.paths.core.bootstrap),
		mongoose = require('mongoose'),
		express = require('express'),
		path = require('path'),
		app = express(),
		db;

	// Create a mongodb connection
	db = mongoose.createConnection(config.db.url, function (error) {
		if (error) throw error;
	});

	db.once('open', function () {
		// Pull in common and app specific models
		db = bootstrap.getModels(config.paths.shared.models, config, db);
		db = bootstrap.getModels(config.paths.app.models, config, db);
		
		// Express configuration
		app = require(path.join(config.paths.app.config, 'express'))(app, config);

		// Pull in app specific controllers
		app = bootstrap.getControllers(config.paths.app.controllers, app, config, db);
	});
	
	return app;
};







