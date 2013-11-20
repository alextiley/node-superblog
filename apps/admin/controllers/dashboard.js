module.exports.controller = function (app, config, mongoose) {

	var auth = require(config.paths.app.utils + 'passport');

	app.get('/dashboard', function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				response.render('dashboard');
			}
		});
	});

};