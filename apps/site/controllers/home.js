module.exports.controller = function (site, app, mongoose, context) {

	site.get('/home', function (request, response) {
		response.redirect('/');
	});

	site.get('/', function (request, response) {
		response.render('home');
	});

};