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
 *	Configure paths for this app context
 */
self.configureAppPaths = function (context, paths) {

	var contextPath = paths.apps + context + '/';

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
 *	Iterates over each folder in /apps/ (except 'shared'), configured paths and then includes app.js
 */
self.getAllApps = function (app, config, mongoose) {

	var extend = require('node.extend'),
		thisExpressApp,
		contextRoot,
		appConfig;

	fs.readdirSync(config.paths.apps).forEach(function (context) {	
		if (fs.lstatSync(config.paths.apps + context).isDirectory() && context !== 'shared') {
			
			appConfig = extend(true, {}, config);
			appConfig.paths.app = self.configureAppPaths(context, appConfig.paths);

			contextRoot = '/';

			if (context !== 'default') {
				contextRoot += context;
			}

			app.use(contextRoot, require(appConfig.paths.app.root + 'app')(appConfig, mongoose, context));
		}
	});

	return app;
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