var bcrypt = require('bcrypt'),
	mongo = require('mongoose'),
	Schema = mongo.Schema,
	AdministratorSchema;

// Define the schema
AdministratorSchema = new Schema({
	username: String,
	password: String,
	email: String,
	name: String,
	surname: String,
	nickname: String,
	active: Boolean,
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
	
	var administrator = this,
		hash;

	if (!administrator.isModified('password')) {
		return next();
	}

	bcrypt.genSalt(10, function (error, salt) {
		if (error) {
			return next(error);
		}
		bcrypt.hash(administrator.password, salt, function (error, hash) {
			if (error) {
				return next(error);
			}
			administrator.password = hash;
			return next();
		});
	});

});

AdministratorSchema.methods.validatePassword = function (password, callback) {

	bcrypt.compare(password, this.password, function (error, isMatch) {
		if (error) {
			return callback.call(this, error);
		}
		return callback.call(null, isMatch);
	});

};

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

	// @todo: validate administrator...

	administrator.active = true;

	administrator.save(function (error) {
		if (error) {
			response.flash('error', 'Unable to create a new administrator.')
		}
		callback(error);
	});

};

module.exports = mongo.connection.model('Administrator', AdministratorSchema);