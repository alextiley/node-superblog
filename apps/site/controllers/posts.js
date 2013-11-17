var Post = require(app.get('paths').shared.models + 'Post');

module.exports.controller = function (site, app, mongoose, context) {
	
	site.get('/posts', function (request, response) {
		Post.getAllVisiblePosts(request, response, function (posts, paging) {
			response.locals.posts = posts;
			response.locals.paging = paging;
			response.render('posts');
		});
	});

	site.get('/posts/:id', function (request, response) {
		Post.getPost(request, response, function (post) {
			response.locals.post = post;
			response.render('post');
		});
	});

};