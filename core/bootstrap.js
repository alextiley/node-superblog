var extend = require('extend'),
	fs = require('fs'),
	self = {};

self.requireAll = function (path, callback) {
		
	var includeFile;

	fs.readdirSync(path).forEach(function (file) {
		if (file.substr(-3) === '.js') {
			includeFile = require(path + file);
			if (typeof callback === 'function') {
				callback.call(includeFile);
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

	var contextPath = paths.apps.root + appDir + '/';

	return {
		root: contextPath,
		config: contextPath + 'config/',
		middleware: contextPath + 'middleware/',
		utils: contextPath + 'utils/',
		models: contextPath + 'models/',
		views: contextPath + 'views/',
		controllers: contextPath + 'controllers/',
		assets: contextPath + 'views/assets/'
	};
};

self.getAppConfig = function (config) {
	return extend(true, config, require(config.paths.app.root + 'config.json')[config.env]);
}

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

self.initMount = function (app, host, masterConfig) {
	
	var config = extend(true, {}, masterConfig);

	config.paths.app = self.configureAppPaths(app.directory, config.paths);
	config.app = app;

	try {
		host.use(app.path, require(config.paths.app.root + 'app')(config));
	} catch (error) {
		throw(error);
	}

	return host;
};

/* 
 *	Includes all apps defined in /apps.json
 */
self.getMounts = function (app, config) {

	var mounted = [], appPath, mount, i;

	config.mounts = self.sortMounts(config.mounts);

	for (i = 0; i < config.mounts.length; i++) {

		mount = config.mounts[i];
		appPath = config.paths.apps.root + mount.directory;

		if (mount.directory !== 'shared') {
			if (fs.lstatSync(appPath).isDirectory()) {
				if (mounted.indexOf(mount.directory) === -1) {
					app = self.initMount(mount, app, config);
					mounted.push(mount.directory);
				} else {				
					throw new Error('Unable to mount sub-app: \'' + mount.directory +  '\'. A sub-app with the same name has already been mounted.');
				}
			}
		} else {
			throw new Error('Cannot use \'shared\' directory as a sub-app. Directory: \'shared\' is reserved and can not be included.');
		}
	};
	
	if (mounted.length > 0) {
		app.listen(config.server.port);
	}
};

/* 
 *	Loops over all files in a models directory and includes them (invoking .model)
 */
self.getModels = function (path, config, db, app) {
	
	self.requireAll(path, function () {
		this.model(config, db, app);
	});

	return db;
};

/* 
 *	Loops over all files in a controllers directory and includes them (invoking .controller)
 */
self.getControllers = function (app, config, db, context) {
	
	self.requireAll(config.paths.app.controllers, function () {
		this.controller(app, config, db, context);
	});

	return app;
};

module.exports = self;