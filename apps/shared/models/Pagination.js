module.exports.model = function (config, mongoose) {
	
	var Schema = mongoose.Schema,
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

	/*
		When called this static method will return a new Pagination object.
		This method will calculate all of the page data, based on the args.

			var Pagination = mongoose.model('Pagination'),
				paging = Pagination.get(1, 20, 634, '/posts?page=1&results=20');
	*/
	PaginationSchema.statics.get = function (page, results, count, requestUrl) {

		var urlUtils = require(config.paths.shared.utils + 'url'),
			baseUrl = urlUtils.removeQueryAndHashFromUrl(requestUrl),
			totalPages = this.calculateTotalPages(results, count),
			next = this.calculateNextPage(page, totalPages),
			previous = this.calculatePrevPage(page),
			paging = new this();

		paging.previous = previous;
		paging.current = page;
		paging.next = next;
		paging.first = 1;
		paging.last = totalPages;
		paging.firstItem = this.calculateFirstPosition(page, results);
		paging.lastItem = this.calculateLastPosition(page, results, count);
		paging.totalPages = totalPages;
		paging.totalResults = count;
		paging.resultsPerPage = results;
		paging.baseUrl = baseUrl;
		paging.previousUrl = this.getPageUrl(previous, results, baseUrl);
		paging.currentUrl = this.getPageUrl(page, results, baseUrl);
		paging.nextUrl = this.getPageUrl(next, results, baseUrl);
		paging.firstUrl = this.getPageUrl(1, results, baseUrl);
		paging.lastUrl = this.getPageUrl(totalPages, results, baseUrl);

		return paging;
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

	PaginationSchema.statics.getPageUrl = function (page, results, baseUrl) {

		var constants = require(config.paths.shared.utils + 'constants'),
			requestUrl = null,
			isDefaultPage;

		if (page !== null) {

			requestUrl = baseUrl;
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