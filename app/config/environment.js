module.exports = {
	
	development: function () {
		
		app.set('server', {
			port: 3000
		});

		app.set('cookies', {
			secret: 'i-love-cookies'
		});

		app.set('db', {
			url: 'mongodb://localhost/blog',
			username: 'blog',
			password: 'password'
		});

	},
	staging: function () {},
	production: function () {}
};