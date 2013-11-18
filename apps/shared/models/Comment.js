module.exports.model = function (config, mongoose) {

	var Schema = mongoose.Schema,
		ObjectId = Schema.Types.ObjectId,
		CommentSchema;

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

	mongoose.model('Comment', CommentSchema);
}