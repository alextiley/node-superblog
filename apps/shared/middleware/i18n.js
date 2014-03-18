module.exports.enable = function (options) {

	options = options || {};

	options.languages = options.languages || ['en'];
	options.defaultLocale = options.defaultLocale || ['en'];
	options.translations = options.translations || 'locale/';

	return function (request, response, next) {

		var languages = request.acceptedLanguages;



		/*
		

		return new Internationalization(options);
		*/
		next();
	};

};

//require('i18n').i18n('en-GB');

/*
function Internationalization(options) {

	var languages = [],
		defaultLocale,
		locale;

	if (typeof options === 'object') {
		languages = options.languages;
		defaultLocale = options.defaultLocale;
		locale = options.locale;
	}

	this.getLocale = function () {
		return locale;
	};

	this.setLocale = function (localeCode) {
		locale = localeCode;
	};

}
*/