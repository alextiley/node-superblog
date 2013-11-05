module.exports = function (passport) {
	
	var LocalStrategy = require('passport-local').Strategy,
		Administrator = require(app.get('paths').models + 'Administrator').Administrator;

	// Stores a serialized administrator ID in the session		
	passport.serializeUser(function (administrator, done) {
		console.log('serializing administrator into the session.');
		done(null, administrator.id);
	});

	// Retrieves a serialized administrator ID from the session
	passport.deserializeUser(function (administratorId, done) {
		console.log('deserializing administrator from the session.');
		Administrator.getById(administratorId, function (error, administrator) {
			done(error, administrator);
		});
	});

	// Set up local login strategy: 
	passport.use(new LocalStrategy(function (username, password, done) {
		console.log('Executing local strategy - check if login credentials exist in the db...');
		process.nextTick(function () {

			Administrator.getByUsername(username, function (error, administrator) {
				if (error) {
					console.log('query to the database failed!');
					return done(error);
				}
				if (!administrator) {
					console.log('username supplied could not be found in the db!');
					return done(null, false);
				}
				if (administrator.password != password) {
					console.log('user found, but passwords do not match!');
					return done(null, false);
				}
				console.log('username found, passwords match. local strategy method finished.');
				return done(null, administrator);
			})

		});
	}));
};



