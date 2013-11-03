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
	hash: String,
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

AdministratorSchema.statics.getById = function (userId, request, response, callback) {

	var rules = { id: userId };

	this.findOne(rules).exec(function (error, adminUser) {
		if (adminUser) {
			callback.call(adminUser, adminUser);
		} else {
			utils.renderErrorPage(error, request, response, 'Get administrator by userId query failed.');
		}
	});

};

AdministratorSchema.statics.getByUsername = function (username, request, response, callback) {

	var rules = { username: username };

	this.findOne(rules).exec(function (error, adminUser) {
		if (adminUser) {
			callback.call(adminUser, adminUser);
		} else {
			utils.renderErrorPage(error, request, response, 'Get administrator by username query failed.');
		}
	});

};

AdministratorModel = db.model('Administrator', AdministratorSchema);

module.exports.Administrator = AdministratorModel;