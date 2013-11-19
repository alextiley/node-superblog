module.exports.controller = function (app, config, mongoose) {

	var validation = require(config.paths.shared.utils + 'validation'),
		auth = require(config.paths.app.utils + 'passport'),
		Administrator = mongoose.model('Administrator');

	// List all administrator accounts
	app.get('/administrators', function (request, response, next) {
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
	app.get('/administrators/create', function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				response.render('administrator_create');
			}
		});
	});

	// Create a new administrator account (POST)
	app.post('/administrators/create', function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				Administrator.create(request, response, function (mongooseError, administrator) {
					if (mongooseError) {
						request.flash('error', validation.utils.getMongooseFlashErrors(request, mongooseError));
						response.redirect('administrators/create');
					} else {
						request.flash('success', 'The administrator \'' + administrator.username + '\' was successfully created.');
						response.redirect('administrators');
					}
				});
			}
		});
	});

	// Delete an existing administrator account
	app.delete('/administrators/delete/:id', function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				
			}
		});
	});

	// Update an administrator account
	app.put('/administrators/update/:id', function (request, response, next) {
		auth.ensureAuthenticated(request, response, {
			success: function () {
				
			}
		});
	});

};