
module.exports.controller = function () {

	var auth = require(app.get('paths').utils + 'passport');

	app.get(/^\/admin\/dashboard\/?$/, function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				response.render('dashboard');
			}
		});
	});

};