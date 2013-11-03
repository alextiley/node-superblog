module.exports = function () {
	
	var passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy,
		Administrator = require(app.get('paths').models + 'Administrator').Administrator;
		
	// Persistent login sessions
	passport.serializeUser(function (adminUser, done) {
		done(null, adminUser.id);
	});

	passport.deserializeUser(function (adminUserId, done) {
		Administrator.getAdministratorById(adminUserId, function (error, adminUser) {
			done(error, adminUser);
		});
	});

	passport.use(new LocalStrategy(function (username, password, done) {

		process.nextTick(function () {

			Administrator.getByUsername(username, function (error, adminUser) {
				if (error) {
					return done(error);
				}
				if (!adminUser) {
					return done(null, false);
				}
				if (adminUser.password != password) {
					return done(null, false);
				}
				return done(null, adminUser);
			})

		});
	}));

};