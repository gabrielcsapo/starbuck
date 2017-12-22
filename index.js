const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const cache = require('memory-cache');
const nconf = require('nconf');

module.exports = function starbuck(config, port) {
	return new Promise(function(resolve, reject) {
		try {
			nconf.defaults({
				'github': {
					'url': 'https://api.github.com',
					'token': ''
				},
				'gitlab': {
					'url': 'https://gitlab.com/api',
					'token': ''
				},
				'npm': {
					'url': 'http://registry.npmjs.org'
				}
			});

			nconf.argv().env({
				separator: '__',
				lowerCase: true
			});

			nconf.overrides(config);

			const { getDependencies } = require('./lib/starbuck');
			const { getBadge } = require('./lib/util');
			const github = require('./lib/github')(nconf.get('github'));
			const gitlab = require('./lib/gitlab')(nconf.get('gitlab'));

			const supportedServices = ['gitlab', 'github'];
			const supportedBadges = ['dev-status', 'status', 'peer-status'];

			const app = express();
			const asyncMiddleware = (fn) => {
				return (req, res, next) => {
					Promise.resolve(fn(req, res, next)).catch(next);
				};
			};
			const cacheMiddleware = (req, res, next) => {
				const cached = cache.get(req.url);
				if(cached) {
					res.set(cached.headers);
					res.send(cached.content);
				} else {
					res.cache = {
						write: res.write,
						end: res.end,
						content: '',
					};
					res.end = function(content, encoding) {
						if(res.statusCode !== 200) return res.cache.end.apply(this, arguments); // don't cache

						cache.put(req.url, {
							headers: res._headers,
							content,
							encoding
						}, 900000);

						return res.cache.end.apply(this, arguments);
					};
					next();
				}
			};

			app.use(serveStatic('dist'));

			app.get('/api/:service/:owner/repos', cacheMiddleware, asyncMiddleware(async (req, res) => {
				const { service, owner } = req.params;

				let repos = {};
				if(service === 'github') {
					repos = await github.getRepos(owner);
				} else {
					repos = await gitlab.getRepos(owner);
				}

				res.send(repos);
			}));

			app.get('/api/:service/:owner/:repo', asyncMiddleware(async (req, res) => {
				const { service, owner, repo } = req.params;
				if (supportedServices.indexOf(service) === -1) {
					return res.status(500).send({ error: 'service not supported' });
				}

				if (cache.get(`${service}:${owner}:${repo}`)) {
					return res.status(200).send(JSON.stringify(cache.get(`${service}:${owner}:${repo}`)));
				}

				let pack = {};
				let dependencies = {};

				try {
					if(service === 'github') {
						pack = await github.getPackage(owner, repo);
					} else {
						pack = await gitlab.getPackage(owner, repo);
					}

					dependencies = await getDependencies(pack, {
						npm: nconf.get('npm').url
					});
				} catch(ex) {
					return res.status(500).send(JSON.stringify({
						error: 'could not find package'
					}));
				}

				const response = Object.assign({ starbuck: dependencies }, pack);

				cache.put(`${service}:${owner}:${repo}`, response, 900000);

				res.status(200).send(JSON.stringify(response));
			}));

			app.get('/badge/:service/:owner/:repo/:status.svg', cacheMiddleware, asyncMiddleware(async (req, res) => {
				const { service, owner, repo, status } = req.params;

				async function get() {
					let pack = {};

					if(service === 'github') {
						pack = await github.getPackage(owner, repo);
					} else {
						pack = await gitlab.getPackage(owner, repo);
					}
					const dependencies = await getDependencies(pack, {
						npm: nconf.get('npm').url
					});

					return Object.assign({ starbuck: dependencies }, pack);
				}

				try {

					if (supportedServices.indexOf(service) === -1) {
						return res.status(500).send({ error: 'service not supported' });
					}

					if (supportedBadges.indexOf(status) === -1) {
						return res.send(await getBadge('unknown', 'invalid'));
					}

					const response = await get();
					let dep = {
						'dev-status': 'devDependencies',
						'status': 'dependencies',
						'peer-status': 'peerDependencies'
					}[status];

					let dependencies = response.starbuck[dep];

					let type;
					if (Object.keys(dependencies).length === 0) {
						type = 'none';
					} else if (Object.keys(dependencies).filter((d) => dependencies[d].needsUpdating).length > 0) {
						type = 'notsouptodate';
					} else {
						type = 'uptodate';
					}

					res.setHeader('Content-Type', 'image/svg+xml');
					res.send(await getBadge(type, dep));
				} catch(ex) {
					return res.send(await getBadge('unknown', status));
				}
			}));

			app.get('*', (req, res) => {
				res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
			});

			app.use((error, req, res) => {
				res.status(500).send({ error: error.toString() });
			});

			app.listen(port, () => {
				console.log(`starbuck listening at http://localhost:${port}`); // eslint-disable-line
				resolve();
			});

		} catch(ex) {
			reject(ex);
		}
	});
};
