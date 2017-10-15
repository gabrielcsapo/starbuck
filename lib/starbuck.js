const Async = require('async');
const npm = require('npm');
const semver = require('semver');

var unstablePattern = /[a-z+-]/i;

/**
 * Determine if a version is a stable version or not.
 * @param {String} version
 * @return {Boolean}
 */
function isStable (version) {
	return !unstablePattern.test(version || '');
}

/**
 * Determine if a version is a SCM URL or not.
 * @param {String} version
 * @return {Boolean}
 */
function isScm (version) {
	var scmPrefixes = ['git:', 'git+ssh:', 'https:', 'git+https:'];
	var blacklisted = scmPrefixes.filter(function (prefix) {
		return version.indexOf(prefix) === 0;
	});
	return !!blacklisted.length;
}

/**
 * Get the latest stable version from a list of versions in ascending order.
 * @param {Array} versions
 * @return {String}
 */
function getLatestStable (versions) {
	versions = versions.slice();
	while (versions.length) {
		var version = versions.pop();
		if (isStable(version)) {
			return version;
		}
	}
	return null;
}

/**
 * Get the latest version and latest stable version
 * @param {String} current The version you get when you `npm install [package]`
 * @param {Array} versions All versions available
 */
function getLatest(current, versions) {
	var stable = current;
	var latest = versions[versions.length - 1];

	if (!isStable(stable)) {
		stable = getLatestStable(versions);
	}

	// getLatestStable might not have found a stable version
	if (stable) {
		// Latest is the most recent version with higher version than stable
		for (var i = versions.length - 1; i >= 0; i--) {
			if (semver.gt(versions[i], stable, true)) {
				latest = versions[i];
				break;
			}
		}
	}

	return { latest: latest, stable: stable };
}

function getVersionsInRange (range, versions, loose) {
	return versions.filter(function (v) {
		return semver.satisfies(v, range, loose);
	});
}

// Convert dependencies specified as an array to an object
function normaliseDeps (deps) {
	if (Array.isArray(deps)) {
		deps = deps.reduce(function (d, depName) {
			d[depName] = '*';
			return d;
		}, {});
	}
	return deps;
}

function isUpdated(dep, opts) {
	opts = opts || {};

	var required = dep.required || '*';

	// TODO: Handle tags correctly
	if (required !== 'latest' && required !== '*') {
		var range = semver.validRange(required, opts.loose) || '';
		var version = opts.stable ? dep.stable : dep.latest;

		if (version) {
			if (!range) {
				return true;
			} else if (!semver.satisfies(version, range, opts.loose)) {
				if (opts.stable && semver.gtr(version, range, opts.loose)) {
					return true;
				} else if (!opts.stable) {
					return true;
				}
			}
		}
	}
	return false;
}

/**
 * Get a list of dependencies for the passed manifest.
 * @param {Object} manifest Parsed package.json file contents
 * @param {Object|Function} [opts] Options or callback
 * @param {Object} [opts.npm] npm configuration options
 * @param {Function} cb Function that receives the results
 */
function getDependencies(manifest, opts, cb) {
	manifest = manifest || {};

	Async.map(['peerDependencies', 'devDependencies', 'dependencies'], (type, cb) => {
		var pkgs = {};
		var deps = normaliseDeps(manifest[type]);

		if (!deps) {
			return setImmediate(function () { cb(null, pkgs); });
		}

		var depNames = Object.keys(deps);
		var error; // Return any error that occurred but don't stop processing

		if (!depNames.length) {
			return setImmediate(function () { cb(null, pkgs); });
		}

		var tasks = depNames.map(function (depName) {
			var err;
			return function (cb) {
				if (Object.prototype.toString.call(deps[depName]) !== '[object String]') {
					err = new Error('Non-string dependency: ' + deps[depName]);
					err.code = 'EDEPTYPE';

					pkgs[depName] = {required: deps[depName], warn: err};

					return cb();
				}

				if (isScm(deps[depName])) {
					err = new Error('SCM dependency: ' + deps[depName]);
					err.code = 'ESCM';

					pkgs[depName] = {required: deps[depName], warn: err};

					return cb();
				}

				getVersionInfo(depName, opts, function (err, versionsInfo) {
					if (err) {
						if (!opts.error.E404 && err.code === 'E404') {
							if (err === '404 Not Found') {
								err = new Error('404 Not Found: ' + depName);
								err.pkgid = depName;
								err.statusCode = 404;
								err.code = 'E404';
							}

							pkgs[depName] = {required: deps[depName], warn: err};
						} else {
							error = err;
						}
						return cb();
					}

					try {
						var latestVersionInfo = getLatest(versionsInfo.current, versionsInfo.versions);

						pkgs[depName] = {
							required: deps[depName],
							stable: latestVersionInfo.stable,
							latest: latestVersionInfo.latest
						};

						pkgs[depName]['needsUpdating'] = isUpdated(pkgs[depName]);

						if (opts.versions) {
							pkgs[depName].versions = versionsInfo.versions;
						}

						if (opts.rangeVersions) {
							pkgs[depName].rangeVersions = getVersionsInRange(deps[depName], versionsInfo.versions, opts.loose);
						}
					} catch (err) {
						error = err;
					}

					cb();
				});
			};
		});

		Async.parallel(tasks, function() { cb(error, pkgs); });
	}, (error, results) => {
		if(error) return cb(error);
		cb(null, {
			'peerDependencies': results[0],
			'devDependencies': results[1],
			'dependencies': results[2]
		});
	});
}

// TODO: implement memoization

/**
 * Get info about the versions for this dependency. Returns an object with
 * `current` and `versions` properties. Where `current` is the version you'd
 * get when you `npm install [package]` and `versions` is a sorted array of
 * available versions for the dependency.
 * @param {String} name Dependency name
 * @param {Object} opts Options
 * @param {Object} [opts.npm] npm configuration options
 */
function getVersionInfo(name, opts, cb) {
	npm.load(opts.npm || {}, function (err) {
		if (err) return cb(err);

		npm.commands.view([name, 'versions', 'time'], true, function (err, data) {
			if (err) return cb(err);

			var currentVersion = Object.keys(data)[0];
			var versions = null;

			// `npm view 0 versions` returns {}
			if (!currentVersion) {
				return cb(new Error('Failed to get versions for ' + name));
			}

			// Some packages simply don't have a time object
			if (data[currentVersion].time) {
				versions = data[currentVersion].versions.sort(function (a, b) {
					a = data[currentVersion].time[a];
					b = data[currentVersion].time[b];
					return (a < b ? -1 : (a > b ? 1 : 0));
				});
			} else {
				versions = data[currentVersion].versions;
			}

			return cb(null, { current: currentVersion, versions: versions });
		});
	});
}

module.exports = {
	getVersionInfo,
	getDependencies
};