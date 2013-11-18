module.exports.controller = function (app, config, mongoose, context) {

	var auth = require(config.paths.app.utils + 'passport');

	app.get('/admin', function (request, response) {
		response.redirect('/admin/login');
	});

	app.get('/admin/login', function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				response.redirect('/admin/dashboard');
			},
			failure: function () {
				response.render('login');
			}
		});
	});

	app.post('/admin/login', function (request, response, next) {
		auth.authoriseLogin(request, response, next, {
			success: function (user) {

				var successRedirect = '/admin/dashboard';

				if (request.session.originalUrl) {
					successRedirect = request.session.originalUrl;
					delete(request.session.originalUrl);
				}
				
				request.flash('success', 'Welcome ' + user.name + '! You have successfully logged in.');
				response.redirect(successRedirect);
			},
			failure: function () {
				request.flash('error', 'Please enter a valid username and password.');
				response.redirect('/admin/login');
			}
		});
	});

};