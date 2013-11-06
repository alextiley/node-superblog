module.exports = function () {
	
	var LocalStrategy = require('passport-local').Strategy,
		Administrator = require(app.get('paths').models + 'Administrator').Administrator,
		passport = require('passport');	

	// This method initializes an active login by storing a
	// serialized administrator in to the session.
	passport.serializeUser(function (administrator, done) {
		done(null, administrator.id);
	});

	// This method re-populates the administrator object back in to subsequent 
	// requests whenever an active login session exists.
	passport.deserializeUser(function (administratorId, done) {
		Administrator.getById(administratorId, function (error, administrator) {
			done(error, administrator);
		});
	});

	// Set up the local login strategy for administrator user types
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



