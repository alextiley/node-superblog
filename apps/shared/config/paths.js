module.exports = function (root) {

	var paths = {};

	paths.root = root;
	paths.apps = paths.root + '/apps/';

	paths.shared = {};
	paths.shared.root = paths.apps + 'shared/';
	paths.shared.utils = paths.shared.root + 'utils/';
	paths.shared.config = paths.shared.root + 'config/';
	paths.shared.middleware = paths.shared.root + 'config/middleware/';
	paths.shared.models = paths.shared.root + 'models/';
	paths.shared.views = paths.shared.root + 'views/';
	paths.shared.controllers = paths.shared.root + 'controllers/';

	return paths;

};