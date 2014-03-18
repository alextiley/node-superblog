module.exports.controller = function (app, config, db) {

	app.get('/dashboard', function (request, response, next) {
		request.flash('success', request.gettext('login.sucess'));
		response.render('dashboard');
	});

};