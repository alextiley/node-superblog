var utils = require(app.get('paths').utils + 'app')(),
	mongo = require('mongoose'),
	Schema = mongo.Schema,
	ObjectId = Schema.Types.ObjectId,
	PostSchema;

PostSchema = new Schema({
	title: String,
	summary: String,
	content: String,
	created: {
		type: Date,
		default: Date.now
	},
	modified: {
		type: Date,
		default: Date.now
	},
	author: {
		type: ObjectId,
		ref: 'Author'
	},
	comments: {
		type: [ObjectId],
		ref: 'Comment'
	},
	visible: Boolean,
	meta: {
		likes: Number,
		tags: [String]
	}
});

PostSchema.statics = {

	getPostCount: function (request, response, rules, callback) {

		var clazz = this;

		this.count(rules, function (error, count) {
			if (count) {
				callback.call(clazz, count);
			} else {
				utils.renderErrorPage(error, request, response, 'Get post count query failed.');
			}
		});

	},

	// Needs refactoring - ideally post count would be stored somewhere and queried once
	getAllVisiblePosts: function (request, response, callback) {
		
		var Pagination = require(app.get('paths').shared.models + 'Pagination'),
			results = utils.getResultsFromRequest(request),
			page = utils.getPageFromRequest(request),
			rules = { visible: true },
			totalPages,
			start;

		this.getPostCount(request, response, rules, function (count) {

			// Now we have the post count, ensure request falls within page boundaries
			totalPages = Pagination.prototype.calculateTotalPages(results, count);
			page = Pagination.prototype.validatePageBoundaries(page, totalPages);
			start = results * (page - 1),

			// Do the actual get posts query with the request arguments
			this.find(rules).skip(start).limit(results).exec(function (error, posts) {
				
				if (posts) {
					callback.call(posts, posts, new Pagination(page, results, count, request.url));
				} else {
					utils.renderErrorPage(error, request, response, 'Get all visible posts query failed.');
				}

			});

		});

	},

	getAllPosts: function (request, callback) {
		return this.find(callback);
	}

};

module.exports = mongo.connection.model('Post', PostSchema);