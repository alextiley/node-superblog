module.exports.controller = function (app, config, db) {

	var path = require('path'),
		Administrator = db.model('Administrator'),
		constants = require(path.join(config.paths.shared.utils, 'constants'));

	app.get('/', function (request, response) {
		response.redirect('login');
	});

	app.get('/login', function (request, response, next) {
		response.render('login');
	});

	app.post('/login', function (request, response, next) {

		Administrator.authenticate(request, response, next, {
			success: function (user) {

				var successRedirect = 'dashboard';

				if (request.session.originalUrl) {
					successRedirect = request.session.originalUrl;
					delete(request.session.originalUrl);
				}
				
				request.flash(constants.FLASH_SUCCESS, 'Welcome ' + user.name + '! You have successfully logged in.');
				response.redirect(successRedirect);
			},
			failure: function () {
				request.flash(constants.FLASH_ERROR, 'Please enter a valid username and password.');
				response.redirect('login');
			}
		});

	});

};