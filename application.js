var express = require('express'),
	mongoose = require('mongoose'),
	app = module.exports = express(),
	config = {},
	bootstrap;

// Set environment global
global._env = process.env.NODE_ENV || 'development';

// Get path configuration
config.paths = require(__dirname + '/apps/shared/config/paths')(__dirname);

// Environment specific configuration
config = require(config.paths.shared.config + _env)(config);

// Bootstrap database connection
mongoose.connect(config.db.url, function (error) {
	if (error) throw error;
});

// Only start the server if the db is up and running
mongoose.connection.once('open', function () {
	
	bootstrap = require(config.paths.shared.utils + 'bootstrap');

	// Pull in shared mongoose schema definitions
	mongoose = bootstrap.getModels(config.paths.shared.models, config, mongoose);

	// Dynamically pull in each sub-app context
	app = bootstrap.getMounts(app, config, mongoose);

	// Start the server
	app.listen(config.server.port);

});