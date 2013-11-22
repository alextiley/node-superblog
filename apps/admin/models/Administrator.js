module.exports.model = function (config, db) {

	var path = require('path'),
		validators = require(path.join(config.paths.shared.utils, 'validation')).validators,
		Schema = require('mongoose').Schema,
		passport = require('passport'),
		crypto = require('crypto'),
		AdministratorSchema;

	AdministratorSchema = new Schema({
		username: {
			type: String,
			required: true,
			validate: [
				{ validator: validators.unique },
				{ validator: validators.username }
			]
		},
		password: {
			type: String,
			required: true,
			validate: validators.password
		},
		salt: {
			type: String
		},
		email: {
			type: String,
			required: true,
			unique: true,
			validate: [
				{ validator: validators.unique },
				{ validator: validators.email }
			]
		},
		name: {
			type: String,
			required: true
		},
		surname: {
			type: String,
			required: true
		},
		nickname: {
			type: String
		},
		active: {
			type: Boolean,
			required: true
		},
		created: {
			type: Date,
			default: Date.now
		},
		modified: {
			type: Date,
			default: Date.now
		}
	});

	/*
	 *	Administrator pre-save middleware
	 *
	 *	Before saving the administrator, ensure that a new hash is generated
	 *	with a unique salt. Also store the salt for retrieval later.
	 */
	AdministratorSchema.pre('save', function (next) {
		
		var self = this,
			hash;

		if (!self.isModified('password')) {
			return next();
		}

		self.constructor.getSalt(function (error, salt) {

			if (error) {
				next(error);
			}

			self.salt = salt.toString('hex');

			self.constructor.getHash(self.password, self.salt, function (error, key) {

				if (error) {
					return next(error);
				}

				self.password = self.salt.concat(key.toString('hex'));

				return next();
			});

		});

	});

	AdministratorSchema.methods.validatePassword = function (guess, callback) {

		var hash = this.password,
			salt = this.salt;

		this.constructor.getHash(guess, salt, function (error, guessHash) {
			callback(error, hash === salt.concat(guessHash.toString('hex')));
		});
	};

	AdministratorSchema.statics.getSalt = function (callback) {
		crypto.randomBytes(256, callback);
	};

	AdministratorSchema.statics.getHash = function (phrase, salt, callback) {
		crypto.pbkdf2(phrase, salt, 25000, 512, callback);
	};

	AdministratorSchema.statics.getAll = function (callback) {
		this.find(function (error, administrators) {
			callback.call(administrators, error, administrators);
		});
	};

	AdministratorSchema.statics.getById = function (id, callback) {

		var rules = { _id: id };

		this.findOne(rules).exec(function (error, administrator) {
			callback.call(administrator, error, administrator);
		});

	};

	AdministratorSchema.statics.getByUsername = function (username, callback) {
		
		var rules = { username: username };

		this.findOne(rules).exec(function (error, administrator) {
			callback.call(administrator, error, administrator);
		});

	};

	/*
	 *	When executed the passport.authenticate looks for a 'username' and 'password' in the request object.
	 *	If invokes the local strategy set up in config/passport.js which checks if the credentials match in the db.
	 *	If an administrator is found and credentials match, the success callback is executed.
	 */
	AdministratorSchema.statics.authenticate = function (request, response, next, callbacks) {
		passport.authenticate('local', function (error, administrator, info) {
			if (error) {
				return next(error);
			}
			if (!administrator) {
				return callbacks.failure(administrator, info);
			}
			request.logIn(administrator, function (error) {
				if (error) {
					return next(error);
				}
				return callbacks.success(administrator, info);
			});
		})(request, response, next);
	};

	/*
	 *	Checks if the admin user is authenticated, then fires the relevant callback method
	 */
	AdministratorSchema.statics.isAuthenticated = function (request, response, callbacks) {
		
		if (request.isAuthenticated()) {
			callbacks.success.call()
		} else {
			if (typeof callbacks.failure === 'function') {
				callbacks.failure.call();
			} else {
				request.session.originalUrl = request.originalUrl;
				request.flash('info', 'Please log in to continue.');
				response.redirect('/admin/login');
			}
		}
	};

	AdministratorSchema.statics.create = function (request, response, callback) {
		
		var administrator = new this(request.body);

		administrator.active = true;

		administrator.save(function (error, administrator) {
			callback(error, administrator);
		});

	};

	db.model('Administrator', AdministratorSchema);
}