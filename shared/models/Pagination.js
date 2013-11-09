var constants = require(app.get('paths').utils + 'constants'),
	utils = require(app.get('paths').utils + 'app')();

// Constructor
function Pagination(page, results, count, requestUrl) {

	var totalPages = this.calculateTotalPages(results, count),
		next = this.calculateNextPage(page, totalPages),
		previous = this.calculatePrevPage(page);

	this.previous = previous;
	this.current = page;
	this.next = next;
	this.first = 1;
	this.last = totalPages;
	this.firstItem = this.calculateFirstPosition(page, results);
	this.lastItem = this.calculateLastPosition(page, results, count);
	this.totalPages = totalPages;
	this.totalResults = count;
	this.resultsPerPage = results;
	this.baseUrl = utils.removeQueryAndHashFromUrl(requestUrl);
	this.previousUrl = this.getPageUrl(previous, results);
	this.currentUrl = this.getPageUrl(page, results);
	this.nextUrl = this.getPageUrl(next, results);
	this.firstUrl = this.getPageUrl(1, results);
	this.lastUrl = this.getPageUrl(totalPages, results);

}

// Static methods (no instance references)
Pagination.prototype.calculateTotalPages = function (results, count) {
	return Math.ceil(count / results);
}

Pagination.prototype.calculateNextPage = function (page, totalPages) {
	return page < totalPages ? page + 1 : null;
}

Pagination.prototype.calculatePrevPage = function (page) {
	return page > 1 ? page - 1 : null;
}

Pagination.prototype.calculateFirstPosition = function (page, results) {
	return ((page - 1) * results) + 1;
}

Pagination.prototype.calculateLastPosition = function (page, results, count) {
	
	var lastPosition = page * results;

	if (count < lastPosition) {
		lastPosition = lastPosition - (lastPosition - count);
	}
	
	return lastPosition;
}

Pagination.prototype.validatePageBoundaries = function (page, totalPages) {

	if (page > totalPages) {
		page = totalPages;
	} else if (page < 1) {
		page = 1;
	}

	return page;
}

// Instance methods (contains instance references)
Pagination.prototype.getPageUrl = function (page, results) {

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

module.exports = Pagination;