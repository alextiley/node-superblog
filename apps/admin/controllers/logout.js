module.exports.controller = function (app, config, db) {

	var path = require('path'),
		constants = require(path.join(config.paths.shared.utils, 'constants'));

	app.get('/logout', function (request, response, next) {
		request.logOut();
		request.flash(constants.FLASH_SUCCESS, 'You have successfully been logged out.');
		response.redirect('login');
	});

};