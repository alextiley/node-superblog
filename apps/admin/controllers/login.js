module.exports.controller = function (app, config, mongoose) {

	var auth = require(config.paths.app.utils + 'passport');

	app.get('/', function (request, response) {
		response.redirect('login');
	});

	app.get('/login', function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				response.redirect('dashboard');
			},
			failure: function () {
				response.render('login');
			}
		});
	});

	app.post('/login', function (request, response, next) {
		auth.authoriseLogin(request, response, next, {
			success: function (user) {

				var successRedirect = 'dashboard';

				if (request.session.originalUrl) {
					successRedirect = request.session.originalUrl;
					delete(request.session.originalUrl);
				}
				
				request.flash('success', 'Welcome ' + user.name + '! You have successfully logged in.');
				response.redirect(successRedirect);
			},
			failure: function () {
				request.flash('error', 'Please enter a valid username and password.');
				response.redirect('login');
			}
		});
	});

};