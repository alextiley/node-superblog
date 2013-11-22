module.exports.controller = function (app, config, db) {

	var path = require('path'),
		Administrator = db.model('Administrator'),
		validation = require(path.join(config.paths.shared.utils, 'validation'));

	// List all administrator accounts
	app.get('/administrators', function (request, response, next) {
		Administrator.getAll(function (error, administrators) {
			if (error) {
				next(error);
			}
			response.render('administrator_list', {
				administrators: administrators
			});
		});
	});

	// Create new administrator account page (GET)
	app.get('/administrators/create', function (request, response, next) {
		response.render('administrator_create');
	});

	// Create a new administrator account (POST)
	app.post('/administrators/create', function (request, response, next) {
		Administrator.create(request, response, function (mongooseError, administrator) {
			if (mongooseError) {
				request.flash('error', validation.utils.getMongooseFlashErrors(request, mongooseError));
				response.redirect('administrators/create');
			} else {
				request.flash('success', 'The administrator \'' + administrator.username + '\' was successfully created.');
				response.redirect('administrators');
			}
		});
	});

	// Delete an existing administrator account
	app.delete('/administrators/delete/:id', function (request, response, next) {

	});

	// Update an administrator account
	app.put('/administrators/update/:id', function (request, response, next) {

	});

};