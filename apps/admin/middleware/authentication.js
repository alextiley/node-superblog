/*
 *	Authentication middleware
 *
 *	Checks if the admin user is authenticated, then redirects to the relevant route
 */
module.exports = function (request, response, next) {

	if (request.isAuthenticated()) {
		if (request.url === '/login') {
			return response.redirect('dashboard');
		}
		return next();
	}

	if (request.url === '/' || request.url === '/login') {
		return next();
	} else if (request.url !== '/logout') {
		request.session.originalUrl = request.originalUrl;
		request.flash('info', 'Please log in to continue.');
	}

	return response.redirect('/admin/login');
};