module.exports = function (root) {

	var paths = {};

	paths.root = root;
	
	paths.apps = {};
	paths.apps.root = paths.root + '/apps/';
	paths.apps.mounts = paths.apps.root + 'mounts.json';

	paths.core = {};
	paths.core.root = paths.root + '/core/';
	paths.core.bootstrap = paths.core.root + 'bootstrap.js';

	paths.shared = {};
	paths.shared.root = paths.apps.root + 'shared/';
	paths.shared.utils = paths.shared.root + 'utils/';
	paths.shared.middleware = paths.shared.root + 'middleware/';
	paths.shared.models = paths.shared.root + 'models/';
	paths.shared.views = paths.shared.root + 'views/';
	paths.shared.controllers = paths.shared.root + 'controllers/';
	paths.shared.assets = paths.shared.views + 'assets/';

	return paths;
};