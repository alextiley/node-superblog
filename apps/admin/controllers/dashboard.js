module.exports.controller = function (app, config, db) {

	app.get('/dashboard', function (request, response, next) {
		response.render('dashboard');
	});

};