module.exports.controller = function (app, config, mongoose) {

	app.get('/logout', function (request, response, next) {
		request.logOut();
		request.flash('success', 'You have successfully been logged out.');
		response.redirect('login');
	});

};