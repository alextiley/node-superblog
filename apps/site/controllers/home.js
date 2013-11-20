module.exports.controller = function (app, config, db) {

	app.get('/home', function (request, response) {
		response.redirect('/');
	});

	app.get('/', function (request, response) {
		response.render('home');
	});

};