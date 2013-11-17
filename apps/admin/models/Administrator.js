module.exports = function (config) {

	var validators = require(config.paths.app.utils + 'validators'),
		crypto = require('crypto'),
		mongo = require('mongoose'),
		Schema = mongo.Schema,
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

	// Before saving the administrator, ensure that a new hash is generated
	// with a unique salt. Also store the salt for retrieval later.
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
	}

	AdministratorSchema.statics.getHash = function (phrase, salt, callback) {
		crypto.pbkdf2(phrase, salt, 25000, 512, callback);
	}

	AdministratorSchema.statics.getAll = function (callback) {
		this.find(function (error, administrators) {
			callback.call(administrators, error, administrators);
		});
	}

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

	AdministratorSchema.statics.create = function (request, response, callback) {
		
		var administrator = new this(request.body);

		administrator.active = true;

		administrator.save(function (error, administrator) {
			callback(error, administrator);
		});

	};

	mongo.connection.model('Administrator', AdministratorSchema);

}