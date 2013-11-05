module.exports = function (passport) {
	
	var LocalStrategy = require('passport-local').Strategy,
		Administrator = require(app.get('paths').models + 'Administrator').Administrator;

	// Stores a serialized administrator ID in the session		
	passport.serializeUser(function (administrator, done) {
		done(null, administrator.id);
	});

	// Retrieves a serialized administrator ID from the session
	passport.deserializeUser(function (administratorId, done) {
		Administrator.getById(administratorId, function (error, administrator) {
			done(error, administrator);
		});
	});

	// Set up local login strategy: 
	passport.use(new LocalStrategy(function (username, password, done) {

		process.nextTick(function () {

			Administrator.getByUsername(username, function (error, administrator) {
				if (error) {
					return done(error);
				}
				if (!administrator) {
					return done(null, false);
				}
				if (administrator.password != password) {
					return done(null, false);
				}
				return done(null, administrator);
			})

		});
	}));
};



