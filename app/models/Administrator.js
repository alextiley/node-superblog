var mongo = require('mongoose'),
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

// Define the model
AdministratorModel = db.model('Administrator', AdministratorSchema);

module.exports.Administrator = AdministratorModel;

// salt should be stored alongside the hash in the admin table
// salts should be generated using a CSPRNG
// salts should be unique per password
// A new random salt must be generated each time a user creates an account or changes their password.
// salt should be long, i.e. longer than the actual hash output at the end...

/*
To Store a Password
-------------------
Generate a long random salt using a CSPRNG.
Prepend the salt to the password and hash it with a standard cryptographic hash function such as SHA256.
Save both the salt and the hash in the user's database record.


To Validate a Password
----------------------
Retrieve the user's salt and hash from the database.
Prepend the salt to the given password and hash it using the same hash function.
Compare the hash of the given password with the hash from the database. If they match, the password is correct. Otherwise, the password is incorrect.
*/