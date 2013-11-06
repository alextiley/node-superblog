var mongo = require('mongoose'),
	utils;

// Set environment
global.env = process.env.NODE_ENV || 'development';
global.app = require('express')();

// Global configuration (sets common paths, etc)
require(__dirname + '/app/config/global')(__dirname);

// Environment specific configuration
require(app.get('paths').config + 'environment')[env]();

// Application utility methods
utils = require(app.get('paths').utils + 'app')();

// Express configuration
require(app.get('paths').config + 'express')();

// Passport configuration
require(app.get('paths').config + 'passport')();

// Bootstrap database connection
mongo.connect(app.get('db').url);

// Start the server and include controllers
mongo.connection.once('open', function () {
	
	// Bootstrap the front-end controllers
	utils.requireAll(app.get('paths').site.controllers, function () {
		this.controller();
	});

	// Load up the admin controllers
	utils.requireAll(app.get('paths').controllers, function () {
		this.controller();
	});

	// Start the application
	app.listen(app.get('server').port);

});