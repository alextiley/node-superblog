
module.exports = function (baseDir) {

	app.set('paths', {
		root: baseDir + '/',
		utils: baseDir + '/app/utils/',
		config: baseDir + '/app/config/',
		models: baseDir + '/app/models/',
		views: baseDir + '/app/views/',
		controllers: baseDir + '/app/controllers/',
		assets: baseDir + '/app/views/assets/',
		site: {
			utils: baseDir + '/site/utils/',
			config: baseDir + '/site/config/',
			models: baseDir + '/site/models/',
			views: baseDir + '/site/views/',
			controllers: baseDir + '/site/controllers/',
			assets: baseDir + '/site/views/assets/'
		},
		shared: {
			utils: baseDir + '/shared/utils/',
			config: baseDir + '/shared/config/',
			models: baseDir + '/shared/models/',
			views: baseDir + '/shared/views/',
			controllers: baseDir + '/shared/controllers/',
			assets: baseDir + '/shared/views/assets/'
		}
	});

};