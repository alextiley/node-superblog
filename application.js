var env = process.env.NODE_ENV || 'development',
	express = require('express'),
	app = express(),
	config = {},
	bootstrap;

// Environment specific configuration
config = require(__dirname + '/config.json')[env];

// Store environment
config.env = env;

// Get path configuration
config.paths = require(__dirname + '/core/paths')(__dirname);

// Get mount configuration (sub-apps)
config.mounts = require(config.paths.apps.mounts);

// Pull in the bootstrapper module 
bootstrap = require(config.paths.core.bootstrap);

// Dynamically pull in each sub-app context
bootstrap.getMounts(app, config);