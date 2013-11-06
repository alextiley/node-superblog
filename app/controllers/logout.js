
module.exports.controller = function () {

	app.get(/^\/admin\/logout\/?$/, function (request, response, next) {
		request.logOut();
		response.redirect('/admin/login');
	});

};