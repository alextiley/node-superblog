var utils = require(app.get('paths').utils + 'app')(app),
	Post = require(app.get('paths').shared.models + 'Post').Post;

module.exports.controller = function () {
	
	app.get('/posts', function (request, response) {

		Post.getAllVisiblePosts(request, response, function (posts, paging) {

			app.locals.posts = posts;
			app.locals.paging = paging;

			response.render('posts');
		});

	});

};