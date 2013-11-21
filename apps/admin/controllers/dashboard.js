module.exports.controller = function (app, config, db) {

	var path = require('path'),
		auth = require(path.join(config.paths.app.utils, 'passport'));

	app.get('/dashboard', function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				response.render('dashboard');
			}
		});
	});

};