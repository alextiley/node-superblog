module.exports.controller = function () {

	app.get(/^(\/|\/home)$/, function (request, response) {
		response.render('home');
	});

};