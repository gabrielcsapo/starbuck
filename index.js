const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const cache = require('memory-cache');
const nconf = require('nconf').argv().env({
	separator: '__',
	lowerCase: true
}).file({ file: __dirname + '/config.json' });

const { getDependencies } = require('./lib/starbuck');
const { getBadge } = require('./lib/util');
const github = require('./lib/github')(nconf.get('github'));
const gitlab = require('./lib/gitlab')(nconf.get('gitlab'));

const supportedServices = ['gitlab', 'github'];
const supportedBadges = ['dev-status', 'status', 'peer-status'];

const app = express();
const port = process.env.PORT || 8000;
const asyncMiddleware = (fn) => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};

app.use(serveStatic('dist'));

app.get('/api/:service/:owner/repos', asyncMiddleware(async (req, res) => {
	const { service, owner } = req.params;
	if (cache.get(`${service}:${owner}:repos`)) {
		return res.status(200).send(JSON.stringify(cache.get(`${service}:${owner}:repos`)));
	}

	let repos = {};
	if(service === 'github') {
		repos = await github.getRepos(owner);
	} else {
		repos = await gitlab.getRepos(owner);
	}

	cache.put(`${service}:${owner}:repos`, repos, 900000);

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
	if(service === 'github') {
		pack = await github.getPackage(owner, repo);
	} else {
		pack = await gitlab.getPackage(owner, repo);
	}

	const dependencies = await getDependencies(pack, {
		npm: 'http://registry.npmjs.org'
	});
	const response = Object.assign({ starbuck: dependencies }, pack);

	cache.put(`${service}:${owner}:${repo}`, response, 900000);

	res.status(200).send(JSON.stringify(response));
}));

app.get('/badge/:service/:owner/:repo/:status.svg', asyncMiddleware(async (req, res) => {
	const { service, owner, repo, status } = req.params;

	if (supportedServices.indexOf(service) === -1) {
		return res.status(500).send({ error: 'service not supported' });
	}

	if (supportedBadges.indexOf(status) === -1) {
		return res.sendFile(getBadge('unknown', ''), {
			lastModified: false,
			etag: false,
			headers: {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Expires': new Date().toUTCString()
			}
		});
	}

	async function get() {
		if (cache.get(`${service}:${owner}:${repo}`)) {
			return cache.get(`${service}:${owner}:${repo}`);
		}

		let pack = {};
		if(service === 'github') {
			pack = await github.getPackage(owner, repo);
		} else {
			pack = await gitlab.getPackage(owner, repo);
		}
		const dependencies = await getDependencies(pack, {
			npm: 'http://registry.npmjs.org'
		});
		const response = Object.assign({ starbuck: dependencies }, pack);

		cache.put(`${service}:${owner}:${repo}`, response, 900000);

		return response;
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

	res.sendFile(getBadge(type, dep), {
		lastModified: false,
		etag: false,
		headers: {
			'Cache-Control': 'no-cache, no-store, must-revalidate',
			'Expires': new Date().toUTCString()
		}
	});
}));

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.use(function (err, req, res) {
	res.status(500).send({ error: err.toString() });
});

app.listen(port, () => {
	console.log(`starbuck listening at http://localhost:${port}`); // eslint-disable-line
});
