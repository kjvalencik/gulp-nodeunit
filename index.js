var through2 = require('through2'),
	nodeunit = require('nodeunit');

module.exports = function (options) {
	var files = [],
		cache = {},
		config;

	config = {
		reporter: 'default'
	};
	if ("object" === typeof options) {
		Object.keys(options).forEach(function (k) {
			config[k] = options[k];
		});
	}

	// Save a copy of the require cache before testing
	Object.keys(require.cache).forEach(function (k) {
		cache[k] = true;
	});

	return through2.obj(function (file, enc, done) {
		files.push(file.path);
		done();
	}, function (done) {
		nodeunit.reporters[config.reporter].run(files, config.reporterOptions, function (err) {
			// Delete any modules that were added to the require cache
			Object.keys(require.cache).filter(function (k) {
				return !cache[k];
			}).forEach(function (k) {
				delete require.cache[k];
			});

			done(err);
		});
	});
};
