/*
 *	Authentication middleware
 *
 *	Checks if the admin user is authenticated, then redirects to the relevant route
 */
module.exports = function (request, response, next, config) {

	var path = require('path'),
		constants = require(path.join(config.paths.shared.utils, 'constants')),
		login = request.url.match(/^\/(login(\/)?)?([\?|#].*)?$/),
		logout = request.url.match(/^\/logout(\/)?([\?|#].*)?$/),
		authorised = request.isAuthenticated();
	/*
	 *	Authenticated users: login requests should forward to dashboard
	 *	- All other requests should go to the next route in the stack
	 */
	if (authorised) {
		if (login) {
			return response.redirect('dashboard');
		}
		return next();
	}

	/*
	 *	Non-authenticated users: always go to the login screen
	 *	- When login request, go to the router (no need to redirect)
	 *	- On other requests, store request URL in session for redirect after login
	 *	- When logout request, bypass rule above (don't store request url in session)
	 */
	if (login) {
		return next();
	} else if (!logout) {
		request.session.originalUrl = request.originalUrl;
		request.flash(constants.FLASH_INFO, 'Please log in to continue.');
	}

	return response.redirect('/admin/login');
};