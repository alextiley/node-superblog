var fs = require('fs'),
	self = {};

self.requireAll = function (path, moduleImportHook) {
		
	var includeFile;

	fs.readdirSync(path).forEach(function (file) {
		if (file.substr(-3) === '.js') {
			includeFile = require(path + file);
			if (typeof moduleImportHook === 'function') {
				moduleImportHook.call(includeFile);
			}
		}
	});
};

/* 
 *	Configure paths for this app's app directory
 */
self.configureAppPaths = function (appDir, paths) {

	var contextPath = paths.apps + appDir + '/';

	return {
		root: contextPath,
		config: contextPath + 'config/',
		middleware: contextPath + 'config/middleware/',
		utils: contextPath + 'utils/',
		models: contextPath + 'models/',
		views: contextPath + 'views/',
		controllers: contextPath + 'controllers/',
		assets: contextPath + 'views/assets/'
	};
};

/* 
 *	Includes all apps defined in /apps.json
 */
self.getAllApps = function (mainApp, mainConfig, mongoose) {

	var mounts = require(mainConfig.paths.root + '/mounts.json').mounts,
		extend = require('node.extend'),
		appPath, config, app;
	
	for (app in mounts) {

		if (mounts.hasOwnProperty(app)) {
		
			app = mounts[app];
			appPath = mainConfig.paths.apps + app.directory;

			if (app.directory !== 'shared') {
				
				if (fs.lstatSync(appPath).isDirectory()) {

					config = extend(true, {}, mainConfig);
					config.paths.app = self.configureAppPaths(app.directory, config.paths);
					config.app = app;

					try {
						mainApp.use(app.path, require(config.paths.app.root + 'app')(config, mongoose));
					} catch (error) {
						throw(error);
					}

				} else {
					throw new Error('Cannot find directory: \'' + app.directory + '\', full path: \'' + appPath + '\'.');
				}

			} else {
				throw new Error('Cannot use \'shared\' directory as a sub-app. Directory: \'shared\' was not included.');
			}

		}
	};

	return mainApp;
};

/* 
 *	Loops over all files in a models directory and includes them (invoking .model)
 */
self.getAllModels = function (path, config, mongoose, app) {
	
	self.requireAll(path, function () {
		this.model(config, mongoose, app);
	});

	return mongoose;
};

/* 
 *	Loops over all files in a controllers directory and includes them (invoking .controller)
 */
self.getAllControllers = function (app, config, mongoose, context) {
	
	self.requireAll(config.paths.app.controllers, function () {
		this.controller(app, config, mongoose, context);
	});

	return app;
};

module.exports = self;