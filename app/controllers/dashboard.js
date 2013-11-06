
module.exports.controller = function () {

	var auth = require(app.get('paths').utils + 'passport');

	app.get(/^\/admin\/dashboard\/?$/, function (request, response, next) {
		auth.ensureAuthenticated(request, {
			success: function () {
				response.render('dashboard');
			},
			failure: function () {
				request.flash('info', 'Please log in to continue.');
				response.redirect('/admin/login');
			}
		});
	});

};