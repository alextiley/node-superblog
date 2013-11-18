module.exports.model = function (config, mongoose) {
	
	var Schema = mongoose.Schema,
		ObjectId = Schema.Types.ObjectId,
		PostSchema;

	PostSchema = new Schema({
		title: {
			type: String,
			required: true
		},
		summary: {
			type: String
		},
		content: {
			type: String
		},
		visible: {
			type: Boolean,
			required: true
		},
		url: {
			type: String,
			required: true,
			unique: true
		},
		status: {
			type: String,
			required: true,
			enum: ['DRAFT', 'APPROVAL_REQUIRED', 'APPROVED', 'PUBLISHED', 'ARCHIVED']
		},
		created: {
			type: Date,
			required: true,
			default: Date.now
		},
		modified: {
			type: Date,
			required: true,
			default: Date.now
		},
		author: {
			type: ObjectId,
			required: true,
			ref: 'Author'
		},
		comments: {
			type: [ObjectId],
			ref: 'Comment'
		},
		meta: {
			likes: {
				type: Number,
				default: 0
			},
			tags: {
				type: [String]
			}
		}
	});

	PostSchema.statics = {

		getPostCount: function (request, response, rules, callback) {

			var clazz = this;

			this.count(rules, function (error, count) {
				callback.call(clazz, count, error);
			});

		},

		// Needs refactoring and input validation
		getPost: function (request, response, callback) {

			var rules = { visible: true, _id: request.params.id };

			this.findOne(rules).exec(function (error, post) {
				callback.call(post, post, error);
			});

		},

		// Needs refactoring - ideally post count would be stored somewhere and queried once
		getAllVisiblePosts: function (request, response, callback) {
			
			var paginationUtils = require(config.paths.shared.utils + 'pagination'),
				Pagination = require(app.get('paths').shared.models + 'Pagination'),
				results = paginationUtils.getResultsFromRequest(request),
				page = paginationUtils.getPageFromRequest(request),
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
					callback.call(posts, posts, new Pagination(page, results, count, request.url), error);
				});

			});

		},

		getAllPosts: function (request, callback) {
			return this.find(callback);
		}

	};

	mongoose.model('Post', PostSchema);
};