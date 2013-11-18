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

	var contextRoot = paths.apps + context + '/';

	return {
		root: contextRoot,
		config: contextRoot + 'config/',
		middleware: contextRoot + 'config/middleware/',
		utils: contextRoot + 'utils/',
		models: contextRoot + 'models/',
		views: contextRoot + 'views/',
		controllers: contextRoot + 'controllers/',
		assets: contextRoot + 'views/assets/'
	};
};

/* 
 *	Iterates over each folder in /apps/ (except 'shared'), configured paths and then includes app.js
 */
self.getAllApps = function (app, config, mongoose) {

	var extend = require('node.extend'),
		thisExpressApp,
		appConfig;

	fs.readdirSync(config.paths.apps).forEach(function (context) {	
		if (fs.lstatSync(config.paths.apps + context).isDirectory() && context !== 'shared') {
			
			appConfig = extend(true, {}, config);
			appConfig.paths.app = self.configureAppPaths(context, appConfig.paths);

			app.use(require(appConfig.paths.app.root + 'app')(appConfig, mongoose, context));
		}
	});
};

/* 
 *	Loops over all files in a models directory and includes them (invoking .model)
 */
self.getAllModels = function (path, config, mongoose, app, context) {
	self.requireAll(path, function () {
		this.model(config, mongoose, app, context);
	});
};

/* 
 *	Loops over all files in a controllers directory and includes them (invoking .controller)
 */
self.getAllControllers = function (app, config, mongoose, context) {
	self.requireAll(config.paths.app.controllers, function () {
		this.controller(app, config, mongoose, context);
	});
};

module.exports = self;