
module.exports.controller = function () {

	var passportUtils = require(app.get('paths').utils + 'passport');

	app.get(/^\/admin(\/)?$/, function (request, response) {
		response.redirect('/admin/login');
	});

	app.get(/^\/admin\/login\/?$/, function (request, response, next) {
		passportUtils.authAdminUser(request, response, next, {
			success: function (user) {
				response.redirect('/admin/dashboard');
			},
			failure: function (user) {
				if (request.query.redirect === 'true') {
					request.flash('info', 'Please log in to continue.');
				}
				response.render('login', {
					info: request.flash('info'),
					errors: request.flash('error')
				});
			}
		});
	});

	app.post(/^\/admin\/login\/?$/, function (request, response, next) {
		passportUtils.authAdminUser(request, response, next, {
			success: function (user) {
				request.flash('success', 'Welcome ' + user.name + '! You have successfully logged in.');
				response.redirect('/admin/dashboard');
			},
			failure: function (user) {
				request.flash('error', 'Unable to login. Please supply a valid username and password.');
				response.redirect('/admin/login');
			}
		});
	});

};