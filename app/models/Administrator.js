var mongo = require('mongoose'),
	passport = require('passport'),
	Schema = mongo.Schema,
	ObjectId = Schema.Types.ObjectId,
	db = mongo.connection,
	AdministratorModel,
	AdministratorSchema;

// Define the schema
AdministratorSchema = new Schema({
	username: String,
	password: String,
	salt: String,
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
	
	var bcrypt = require('bcrypt'),
		administrator = this,
		hash;

	if (!administrator.isModified('password')) {
		return next();
	}
	
	bcrypt.hash(administrator.password, 10, function (error, hash) {
		
		if (error) {
			return next(error);
		}

		administrator.password = hash;
		
		return next();
	});

});

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

AdministratorSchema.statics.create = function (request, response, callbacks) {
	
	var administrator = new this(request.body);

	// @todo: validate administrator...

	administrator.active = true;
	administrator.save();

};

AdministratorModel = db.model('Administrator', AdministratorSchema);

module.exports = AdministratorModel;