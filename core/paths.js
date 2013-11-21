module.exports = function (root) {

	var path = require('path'),
		paths = {};

	paths.root = root;
	
	paths.apps = {};
	paths.apps.root = path.join(paths.root, '/apps/');
	paths.apps.mounts = path.join(paths.apps.root, 'mounts.json');

	paths.core = {};
	paths.core.root = path.join(paths.root, '/core/');
	paths.core.bootstrap = path.join(paths.core.root, 'bootstrap.js');

	paths.shared = {};
	paths.shared.root = path.join(paths.apps.root, 'shared/');
	paths.shared.utils = path.join(paths.shared.root, 'utils/');
	paths.shared.middleware = path.join(paths.shared.root, 'middleware/');
	paths.shared.models = path.join(paths.shared.root, 'models/');
	paths.shared.views = path.join(paths.shared.root, 'views/');
	paths.shared.controllers = path.join(paths.shared.root, 'controllers/');
	paths.shared.assets = path.join(paths.shared.views, 'assets/');

	return paths;
};