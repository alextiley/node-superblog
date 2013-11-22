module.exports.controller = function (app, config, db) {

	var Administrator = db.model('Administrator'),
		path = require('path');

	app.get('/', function (request, response) {
		response.redirect('login');
	});

	app.get('/login', function (request, response, next) {
		
		Administrator.isAuthenticated(request, response, {
			success: function () {
				response.redirect('dashboard');
			},
			failure: function () {
				response.render('login');
			}
		});

	});

	app.post('/login', function (request, response, next) {
		
		Administrator.authenticate(request, response, next, {
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