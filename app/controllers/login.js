
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
				response.render('login');
			}
		});
	});

	app.post(/^\/admin\/login\/?$/, function (request, response, next) {
		passportUtils.authAdminUser(request, response, next, {
			success: function (user) {
				response.redirect('/admin/dashboard');
			},
			failure: function (user) {
				response.redirect('/admin/login');
			}
		});
	});

};