var extend = require('extend'),
	path = require('path'),
	fs = require('fs'),
	self = {};

/* 
 *	Utility method for requiring a collection of .js files
 */
self.requireAll = function (requirePath, callback) {
		
	var requireFile;

	fs.readdirSync(requirePath).forEach(function (file) {
		if (file.substr(-3) === '.js') {
			requireFile = require(path.join(requirePath, file));
			if (typeof callback === 'function') {
				callback.call(requireFile);
			} else {
				throw new Error('Argument \'callback\' was not supplied or is not a function.');
			}
		}
	});
};

/* 
 *	Configure paths for this app's app directory
 */
self.configureAppPaths = function (appDir, paths) {

	var contextPath = path.join(paths.apps.root, appDir, '/');

	return {
		root: contextPath,
		config: path.join(contextPath, 'config/'),
		middleware: path.join(contextPath, 'middleware/'),
		utils: path.join(contextPath, 'utils/'),
		models: path.join(contextPath, 'models/'),
		views: path.join(contextPath, 'views/'),
		controllers: path.join(contextPath, 'controllers/'),
		assets: path.join(contextPath, 'views/assets/')
	};
};

/*
 *	Order all mounts configured in mounts.json so that '/' is always the final mount point
 *	Mounted sub-app routes will not work if / is mounted first due to app.use() precedences
 */
self.sortMounts = function (mounts) {

	var rootMount,
		i;

	for (i = 0; i < mounts.length; i++) {
		if ((i + 1) !== mounts.length) {
			if (mounts[i].path === '/') {
				rootMount = mounts.splice(i, 1)[0];
				mounts.push(rootMount);
			}
		}
	}

	return mounts;
}

/*
 *	Given a configuration object, this method will merge all properties of a config.json file
 *	from the sub-apps root directory, then returning the merged configuration object.
 */
self.getAppConfig = function (config) {
	return extend(true, config, require(path.join(config.paths.app.root, 'config.json'))[config.env]);
}

/*
 *	This method serves a few purposes:
 *		1. Creates a deep clone of the master config object for mount specific config
 *		2. Pulls in path configuration for this mount, adding the 'app' property to the paths object
 *		3. Adds the current mount to the config object, by adding the 'app' property to the root object
 *		4. Pulls in app specific config (config.json in the mount folder) where it exists
 */
self.getMountConfig = function (mount, masterConfig) {
	
	var config = extend(true, {}, masterConfig),
		appConfig;

	config.paths.app = self.configureAppPaths(mount.directory, config.paths);
	config.app = mount;
		
	try {
		config = self.getAppConfig(config);
	} catch (error) {
		console.info('No app specific configuration detected in ' + config.paths.app.root + '. To enable this feature, add a config.json file to this path and invoke config = bootstrap.getAppConfig(config);');
	}

	return config;
}

/* 
 *	Includes all apps defined in /mounts.json
 */
self.getMounts = function (app, conf) {

	var initialMountCount = app.stack.length,
		mounted = [],
		thisConf, 
		mount,
		i;

	conf.mounts = self.sortMounts(conf.mounts);

	for (i = 0; i < conf.mounts.length; i++) {

		mount = conf.mounts[i];

		// Shared cannot be mounted (system reserved)
		if (mount.directory !== 'shared') {
			// Ensure the mount path is an existing directory
			if (fs.lstatSync(path.join(conf.paths.apps.root, mount.directory)).isDirectory()) {
				// Ensure the current mount isn't already mounted
				if (mounted.indexOf(mount.directory) === -1) {
					// Create a new object containing main config + mount specific config
					thisConf = self.getMountConfig(mount, conf);
					// Use the mount as a connect middleware
					app = app.use(mount.path, require(path.join(thisConf.paths.app.root, 'app'))(thisConf));
					// Keep track of mounted paths to avoid duplicates
					mounted.push(mount.directory);
				} else {
					throw new Error('Unable to mount sub-app: \'' + mount.directory +  '\'. A sub-app with the same name has already been mounted.');
				}
			}
		} else {
			throw new Error('Cannot use \'shared\' directory as a sub-app. Directory: \'shared\' is reserved and can not be included.');
		}
	};

	// Only start the server if apps have been mounted
	if (app.stack.length > initialMountCount) {
		app.listen(conf.server.port);
	}
};

/* 
 *	Loops over all files in a models directory and includes them (invoking .model)
 *	Arguments:
 *		path - the path that include multiple controllers - all .js files here will be included
 *		config [optional] - the configuration object for this app
 *		db [optional] - the database connection to pass to your model
 */
self.getModels = function (path, config, db) {
	
	self.requireAll(path, function () {
		this.model(config, db);
	});

	return db;
};

/* 
 *	Loops over all files in a controllers directory and includes them (invoking .controller)
 *	Arguments:
 *		path - the path that include multiple controllers - all .js files here will be included
 *		app [optional] - the express application to pass to the controller
 *		config [optional] - the configuration object for this app
 *		db [optional] - the database connection to pass to your controller
 */
self.getControllers = function (path, app, config, db) {
	
	self.requireAll(path, function () {
		this.controller(app, config, db);
	});

	return app;
};

module.exports = self;