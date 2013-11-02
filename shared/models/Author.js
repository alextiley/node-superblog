var mongo = require('mongoose'),
	Schema = mongo.Schema,
	ObjectId = Schema.Types.ObjectId,
	db = mongo.connection,
	AuthorSchema,
	AuthorModel;

// Define the schema
AuthorSchema = new Schema({
	email: String,
	password: String,
	name: String,
	surname: String,
	nickname: String,
	birthday: Date,
	status: String,
	comments: {
		type: [ObjectId],
		ref: 'Comment'
	},
	posts: {
		type: [ObjectId],
		ref: 'Post'
	},
	active: Boolean,
	created: {
		type: Date,
		default: Date.now
	},
	modified: {
		type: Date,
		default: Date.now
	},
	meta: {
		postsLiked: {
			type: [ObjectId],
			ref: 'Post'
		},
		commentsLiked: {
			type: [ObjectId],
			ref: 'Comment'
		},
	}
});

// Define the model
AuthorModel = db.model('Author', AuthorSchema);

module.exports.Author = AuthorModel;