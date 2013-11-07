
module.exports.controller = function () {

	app.get(/^\/admin\/logout\/?$/, function (request, response, next) {
		request.logOut();
		request.flash('success', 'You have successfully been logged out.');
		response.redirect('/admin/login');
	});

};