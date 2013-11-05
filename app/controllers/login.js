
module.exports.controller = function () {

	var auth = require(app.get('paths').utils + 'passport');

	app.get(/^\/admin(\/)?$/, function (request, response) {
		response.redirect('/admin/login');
	});

	app.get(/^\/admin\/login\/?$/, function (request, response, next) {
		console.log('login page requested, checking for user in session...');
		auth.ensureAuthenticated(request, {
			success: function () {
				console.log('authenticated, go to dashboard.');
				response.redirect('/admin/dashboard');
			},
			failure: function () {
				console.log('not authenticated, user needs to log in...');
				if (request.query.redirect === 'true') {
					request.flash('info', 'Please log in to continue.');
				}
				response.render('login');
			}
		});
	});

	app.post(/^\/admin\/login\/?$/, function (request, response, next) {
		console.log('attempting to login...');
		auth.authoriseLogin(request, response, next, {
			success: function (user) {
				console.log('credentials valid, logged in. go to dashboard.');
				request.flash('success', 'Welcome ' + user.name + '! You have successfully logged in.');
				response.redirect('/admin/dashboard');
			},
			failure: function (user) {
				console.log('credentials invalid, NOT logged in. go to login.');
				request.flash('error', 'Unable to login. Please supply a valid username and password.');
				response.redirect('/admin/login');
			}
		});
	});

};