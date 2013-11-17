module.exports.controller = function (app, config, mongoose, context) {

	var auth = require(config.paths.app.utils + 'passport')(config);

	app.get('/admin/dashboard', function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				response.render('dashboard');
			}
		});
	});

};