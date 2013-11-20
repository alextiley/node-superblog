module.exports.model = function (config, db) {

	var Schema = require('mongoose').Schema,
		ObjectId = Schema.Types.ObjectId,
		AuthorSchema;

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

	db.model('Author', AuthorSchema);
}