var through2   = require('through2'),
	nodeunit   = require('nodeunit'),
	baseConfig = require('nodeunit/bin/nodeunit.json');

var extend;

extend = function (a, b) {
	Object.keys(b).forEach(function (k) {
		a[k] = b[k];
	});
	return a;
};

module.exports = function (options) {
	var files = [],
		cache = {},
		config, reporter;

	config = extend({
		reporter: 'default'
	}, baseConfig);

	if ("object" === typeof options) {
		config = extend(config, options);
	}

	reporter = nodeunit.reporters[config.reporter];
	if (!reporter) {
		reporter = require('reporter');
	}

	// Save a copy of the require cache before testing
	Object.keys(require.cache).forEach(function (k) {
		cache[k] = true;
	});

	return through2.obj(function (file, enc, done) {
		files.push(file.path);
		done();
	}, function (done) {
		reporter.run(files, config.reporterOptions, function (err) {
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
