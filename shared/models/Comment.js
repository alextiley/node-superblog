var mongo = require('mongoose'),
	Schema = mongo.Schema,
	ObjectId = Schema.Types.ObjectId,
	db = mongo.connection,
	CommentSchema,
	CommentModel;

// Define the schema
CommentSchema = new Schema({
	content: String,
	author: {
		type: ObjectId,
		ref: 'Author'
	},
	post: {
		type: ObjectId,
		ref: 'Post'
	},
	visible: Boolean,
	comments: {
		type: ObjectId,
		ref: 'Comment'
	},
	created: {
		type: Date,
		default: Date.now
	},
	modified: {
		type: Date,
		default: Date.now
	},
	meta: {
		likes: {
			type: [ObjectId],
			ref: 'Author'
		},
	}
});

// Define the model
CommentModel = db.model('Comment', CommentSchema);

module.exports.Comment = CommentModel;