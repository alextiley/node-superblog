module.exports.controller = function (app, config, mongoose, context) {

	var validation = require(config.paths.shared.utils + 'validation'),
		auth = require(config.paths.app.utils + 'passport'),
		Administrator = mongoose.model('Administrator');

	// List all administrator accounts
	app.get('/admin/administrators', function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				Administrator.getAll(function (error, administrators) {
					if (error) {
						next(error);
					}
					response.render('administrator_list', {
						administrators: administrators
					});
				});
			}
		});
	});

	// Create new administrator account page (GET)
	app.get('/admin/administrators/create', function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				response.render('administrator_create');
			}
		});
	});

	// Create a new administrator account (POST)
	app.post('/admin/administrators/create', function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				Administrator.create(request, response, function (mongooseError, administrator) {
					if (mongooseError) {
						request.flash('error', validation.utils.getMongooseFlashErrors(request, mongooseError));
						response.redirect('/admin/administrators/create');
					} else {
						request.flash('success', 'The administrator \'' + administrator.username + '\' was successfully created.');
						response.redirect('/admin/administrators');
					}
				});
			}
		});
	});

	// Delete an existing administrator account
	app.delete('/admin/administrators/delete/:id', function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				
			}
		});
	});

	// Update an administrator account
	app.put('/admin/administrators/update/:id', function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				
			}
		});
	});

};