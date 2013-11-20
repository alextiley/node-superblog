module.exports.controller = function (app, config, db) {

	app.get('/logout', function (request, response, next) {
		request.logOut();
		request.flash('success', 'You have successfully been logged out.');
		response.redirect('login');
	});

};