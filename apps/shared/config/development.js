module.exports = function (config) {

	config.server = {};
	config.server.port = 3000;

	config.cookies = {};
	config.cookies.secret = 'i-love-cookies';

	config.db = {};
	config.db.url = 'mongodb://localhost/blog';
	config.db.username = 'blog';
	config.db.password = 'password';
	
	return config;
};