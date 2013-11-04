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
	//hash: String, // @todo: encryption
	//salt: String, // @todo: encryption
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

AdministratorSchema.statics.getById = function (id, request, response, callback) {

	var rules = { id: id };

	this.findOne(rules).exec(function (error, administrator) {
		if (administrator) {
			callback.call(administrator, administrator);
		} else {
			utils.renderErrorPage(error, request, response, 'Get administrator by id query failed.');
		}
	});

};

AdministratorSchema.statics.getByUsername = function (username, request, response, callback) {
	
	var rules = { username: username };

	this.findOne(rules).exec(function (error, administrator) {
		if (administrator) {
			callback.call(administrator, administrator);
		} else {
			utils.renderErrorPage(error, request, response, 'Get administrator by username query failed.');
		}
	});

};

AdministratorModel = db.model('Administrator', AdministratorSchema);

module.exports.Administrator = AdministratorModel;