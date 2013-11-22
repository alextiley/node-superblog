module.exports.controller = function (app, config, db) {

	var Administrator = db.model('Administrator'),
		path = require('path');

	app.get('/dashboard', function (request, response, next) {
		Administrator.isAuthenticated(request, response, {
			success: function () {
				response.render('dashboard');
			}
		});
	});

};