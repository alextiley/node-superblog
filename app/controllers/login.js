
module.exports.controller = function () {

	// @todo: auth, then redirect to login / dashboard
	app.get(/^\/admin(\/)?$/, function (request, response) {
		response.redirect('/admin/login');
	});

	app.get(/^\/admin\/login\/?$/, function (request, response) {
		response.render('login');
	});

};