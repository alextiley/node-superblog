module.exports.controller = function () {

	var Administrator = require(app.get('paths').models + 'Administrator'),
		auth = require(app.get('paths').utils + 'passport');

	// List all administrator accounts
	app.get(/^\/admin\/administrators\/list\/?$/, function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				Administrator.getAll(function (error, administrators) {
					if (error) {
						next(error);
					}
					response.render('administrators/list', {
						administrators: administrators
					});
				});
			}
		});
	});

	// Create new administrator account page (GET)
	app.get(/^\/admin\/administrators\/create\/?$/, function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				response.render('administrators/create');
			}
		});
	});

	// Create a new administrator account (POST)
	app.post(/^\/admin\/administrators\/create\/?$/, function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				Administrator.create(request, response, function (error) {
					if (error) {
						response.redirect('/admin/administrators/create');
					} else {
						response.redirect('/admin/administrators/list');
					}
				});
			}
		});
	});

	// Delete an existing administrator account
	app.delete(/^\/admin\/administrators\/delete\/:id?$/, function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				
			}
		});
	});

	// Update an administrator account
	app.put(/^\/admin\/administrators\/update\/:id?$/, function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				
			}
		});
	});

};