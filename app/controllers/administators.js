module.exports.controller = function () {

	var auth = require(app.get('paths').utils + 'passport');

	app.get(/^\/admin\/administrators\/?$/, function (request, response, next) {
		auth.ensureAuthenticated(request, {
			success: function () {
				response.render('administrators');
			}
		});
	});

};