
module.exports.controller = function () {

	var auth = require(app.get('paths').utils + 'passport');

	app.get(/^\/admin\/dashboard\/?$/, function (request, response, next) {
		console.log('dashboard page requested, checking for user in session...');
		auth.ensureAuthenticated(request, {
			success: function () {
				console.log('authenticated, show dashboard');
				response.render('dashboard');
			},
			failure: function () {
				response.redirect('/admin/login');
			}
		});
	});

};