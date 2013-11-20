module.exports.model = function (config, mongoose) {

	var Schema = mongoose.Schema,
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

	mongoose.model('Author', AuthorSchema);
}