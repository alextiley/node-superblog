module.exports.controller = function (app, config, mongoose, context) {

	app.get('/home', function (request, response) {
		response.redirect('/');
	});

	app.get('/', function (request, response) {
		console.log('GO!');
		response.render('home');
	});

};