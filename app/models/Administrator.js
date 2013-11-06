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

AdministratorModel = db.model('Administrator', AdministratorSchema);

module.exports.Administrator = AdministratorModel;