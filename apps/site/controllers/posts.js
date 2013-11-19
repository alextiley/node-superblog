module.exports.controller = function (app, config, mongoose) {

	var Post = mongoose.model('Post');
	
	app.get('/posts', function (request, response) {
		Post.getAllVisiblePosts(request, response, function (posts, paging) {
			response.locals.posts = posts;
			response.locals.paging = paging;
			response.render('posts');
		});
	});

	app.get('/posts/:id', function (request, response) {
		Post.getPost(request, response, function (post) {
			response.locals.post = post;
			response.render('post');
		});
	});

};