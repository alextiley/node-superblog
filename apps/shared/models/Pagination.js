module.exports.model = function (config, mongoose) {
	
	var constants = require(config.paths.shared.utils + 'constants'),
		urlUtils = require(config.paths.shared.utils + 'url'),
		Schema = mongoose.Schema,
		ObjectId = Schema.Types.ObjectId,
		PaginationSchema;

	PaginationSchema = new Schema({
		previous: Number,
		current: Number,
		next: Number,
		first: Number,
		last: Number,
		firstItem: Number,
		lastItem: Number,
		totalPages: Number,
		totalResults: Number,
		resultsPerPage: Number,
		baseUrl: String,
		previousUrl: String,
		currentUrl: String,
		nextUrl: String,
		firstUrl: String,
		lastUrl: String
	});

	PaginationSchema.methods.construct = function (page, results, count, requestUrl) {

		var totalPages = this.constructor.calculateTotalPages(results, count),
			next = this.constructor.calculateNextPage(page, totalPages),
			previous = this.constructor.calculatePrevPage(page);

		this.previous = previous;
		this.current = page;
		this.next = next;
		this.first = 1;
		this.last = totalPages;
		this.firstItem = this.constructor.calculateFirstPosition(page, results);
		this.lastItem = this.constructor.calculateLastPosition(page, results, count);
		this.totalPages = totalPages;
		this.totalResults = count;
		this.resultsPerPage = results;
		this.baseUrl = urlUtils.removeQueryAndHashFromUrl(requestUrl);
		this.previousUrl = this.getPageUrl(previous, results);
		this.currentUrl = this.getPageUrl(page, results);
		this.nextUrl = this.getPageUrl(next, results);
		this.firstUrl = this.getPageUrl(1, results);
		this.lastUrl = this.getPageUrl(totalPages, results);
	}

	PaginationSchema.statics.calculateTotalPages = function (results, count) {
		return Math.ceil(count / results);
	}

	PaginationSchema.statics.calculateNextPage = function (page, totalPages) {
		return page < totalPages ? page + 1 : null;
	}

	PaginationSchema.statics.calculatePrevPage = function (page) {
		return page > 1 ? page - 1 : null;
	}

	PaginationSchema.statics.calculateFirstPosition = function (page, results) {
		return ((page - 1) * results) + 1;
	}

	PaginationSchema.statics.calculateLastPosition = function (page, results, count) {
		var lastPosition = page * results;
		if (count < lastPosition) {
			lastPosition = lastPosition - (lastPosition - count);
		}
		return lastPosition;
	}

	PaginationSchema.statics.validatePageBoundaries = function (page, totalPages) {
		if (page > totalPages) {
			page = totalPages;
		} else if (page < 1) {
			page = 1;
		}
		return page;
	}

	PaginationSchema.methods.getPageUrl = function (page, results) {

		var requestUrl = null,
			isDefaultPage;

		if (page !== null) {

			requestUrl = this.baseUrl;
			isDefaultPage = page === constants.DEFAULT_PAGE;
			
			if (!isDefaultPage) {
				requestUrl += '?' + constants.PAGE_PARAM + '=' + page;
			}

			if (results !== constants.DEFAULT_RESULTS) {
				requestUrl += (isDefaultPage ? '?' : '&') + constants.RESULTS_PARAM + '=' + results;
			}
		}

		return requestUrl;
	}

	mongoose.model('Pagination', PaginationSchema);
};