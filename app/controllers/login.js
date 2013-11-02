
module.exports.controller = function () {

	app.get('/admin/login', function (request, response) {
		response.render('login');
	});

};
