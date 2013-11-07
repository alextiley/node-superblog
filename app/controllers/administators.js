module.exports.controller = function () {

	var auth = require(app.get('paths').utils + 'passport');

	// List all administrator accounts
	app.get(/^\/admin\/administrators\/?$/, function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				response.render('administrators');
			}
		});
	});

	// Create a new administrator account
	app.put(/^\/admin\/administrators\/create\/:id?$/, function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				
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
	app.post(/^\/admin\/administrators\/update\/:id?$/, function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				
			}
		});
	});

};