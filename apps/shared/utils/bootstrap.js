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
 *	Order all mounts configured in mounts.json so that '/' is always the final mount point
 *	Mounted sub-app routes will not work if / is mounted first (perhaps a bug in express?)
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

self.initMount = function (app, host, masterConfig, mongoose) {
	
	var extend = require('node.extend'), // deprecated, needs updating
		config = extend(true, {}, masterConfig);
	
	config.paths.app = self.configureAppPaths(app.directory, config.paths);
	config.app = app;

	try {
		host.use(app.path, require(config.paths.app.root + 'app')(config, mongoose));
	} catch (error) {
		throw(error);
	}

	return host;
};

/* 
 *	Includes all apps defined in /apps.json
 */
self.getMounts = function (app, config, mongoose) {

	var mounts = self.sortMounts(require(config.paths.root + '/mounts.json').mounts),
		mounted = [], appPath, mount, i;
	console.log(mounts);
	for (i = 0; i < mounts.length; i++) {

		mount = mounts[i];
		appPath = config.paths.apps + mount.directory;

		if (mount.directory !== 'shared') {
			if (fs.lstatSync(appPath).isDirectory()) {
				if (mounted.indexOf(mount.directory) === -1) {
					app = self.initMount(mount, app, config, mongoose);
					mounted.push(mount.directory);
					console.info('sub-app \'%s\' was successfully mounted! \n', mount.directory);
				} else {				
					throw new Error('Unable to mount sub-app: \'' + mount.directory +  '\'. A sub-app with the same name has already been mounted.');
				}
			}
		} else {
			throw new Error('Cannot use \'shared\' directory as a sub-app. Directory: \'shared\' is reserved and can not be included.');
		}

	};

	return app;
};

/* 
 *	Loops over all files in a models directory and includes them (invoking .model)
 */
self.getModels = function (path, config, mongoose, app) {
	
	self.requireAll(path, function () {
		this.model(config, mongoose, app);
	});

	return mongoose;
};

/* 
 *	Loops over all files in a controllers directory and includes them (invoking .controller)
 */
self.getControllers = function (app, config, mongoose, context) {
	
	self.requireAll(config.paths.app.controllers, function () {
		this.controller(app, config, mongoose, context);
	});

	return app;
};

module.exports = self;