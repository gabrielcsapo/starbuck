const test = require('tape');

const { getDependencies, getVersionInfo } = require('../lib/starbuck');

test('starbuck', (t) => {
	t.plan(2);

	t.test('getVersionInfo', (t) => {
		t.plan(1);

		t.test('should be able to get the correct info the a given module', (t) => {
			getVersionInfo('npm', { npm: 'http://registry.npmjs.org' }, (err, results) => {
				t.equal(typeof results.current, 'string');
				t.ok(Array.isArray(results.versions));
				t.end();
			});
		});

	});

	t.test('getDependencies', (t) => {
		t.plan(1);

		t.test('should be able to retrieve list of dependencies and get current, stable, unstable', (t) => {
			getDependencies({
				'devDependencies': {
					'tape': '^4.8.0',
					'webpack': '^3.6.0',
					'webpack-dev-server': '^2.9.1'
				},
				'dependencies': {
					'async': '^2.5.0',
					'express': '^4.16.1'
				}
			}, {
				npm: 'http://registry.npmjs.org'
			})
				.then((results) => {
					t.deepEqual(Object.keys(results).sort(), ['dependencies', 'devDependencies', 'peerDependencies']);
					t.end();
				})
				.catch((error) => {
					t.notOk(error);
					t.fail();
				});
		});

	});

});
