const path = require('path');
const express = require('express');
const request = require('request');
const serveStatic = require('serve-static');
const cache = require('memory-cache');

const { getDependencies } = require('./lib/starbuck');
const { getBadge } = require('./lib/util');

const app = express();
const port = process.env.PORT || 8000;

app.use(serveStatic('dist'));

app.get('/api/github/:owner/:repo', (req, res) => {
	const { owner, repo } = req.params;
	if (cache.get(`github:${owner}:${repo}`)) {
		return res.status(200).send(cache.get(`github:${owner}:${repo}`));
	}

	request({
		method: 'GET',
		json: true,
		url: `https://api.github.com/repos/${owner}/${repo}/contents/package.json`,
		headers: {
			'User-Agent': 'request'
		}
	}, (err, results) => {
		const pack = JSON.parse(Buffer.from(results.body.content, 'base64').toString('utf8'));

		getDependencies(pack, {
			npm: 'http://registry.npmjs.org'
		}, (error, result) => {
			if (error) return res.status(500).send(error);
			let response = JSON.stringify(Object.assign({
				starbuck: result
			}, pack));

			cache.put(`github:${owner}:${repo}`, response, 900000);

			res.status(200).send(response);
		});
	});
});

app.get('/api/gitlab/:owner/:repo', (req, res) => {
	const { owner, repo } = req.params;
	if (cache.get(`gitlab:${owner}:${repo}`)) {
		return res.status(200).send(cache.get(`gitlab:${owner}:${repo}`));
	}
	const id = encodeURIComponent(`${owner}/${repo}`);

	request({
		method: 'GET',
		json: true,
		url: `https://www.gitlab.com/api/v3/projects/${id}/repository/files/package.json?ref=master`,
		headers: {
			'User-Agent': 'request'
		}
	}, (err, results) => {
		const pack = JSON.parse(Buffer.from(results.body.content, 'base64').toString('utf8'));

		getDependencies(pack, {
			npm: 'http://registry.npmjs.org'
		}, (error, result) => {
			if (error) return res.status(500).send(error);
			let response = JSON.stringify(Object.assign({
				starbuck: result
			}, pack));

			cache.put(`gitlab:${owner}:${repo}`, response, 900000);

			res.status(200).send(response);
		});
	});
});

app.get('/badge/gitlab/:owner/:repo/:status.svg', (req, res) => {
	const allowed = ['dev-status', 'status', 'peer-status'];
	const { owner, repo, status } = req.params;
	if (allowed.indexOf(status) === -1) {
		return res.sendFile(getBadge('unknown', ''), {
			lastModified: false,
			etag: false,
			headers: {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Expires': new Date().toUTCString()
			}
		});
	}

	function get(callback) {
		if (cache.get(`gitlab:${owner}:${repo}`)) {
			return callback(JSON.parse(cache.get(`gitlab:${owner}:${repo}`)));
		}
		const id = encodeURIComponent(`${owner}/${repo}`);

		request({
			method: 'GET',
			json: true,
			url: `https://www.gitlab.com/api/v3/projects/${id}/repository/files/package.json?ref=master`,
			headers: {
				'User-Agent': 'request',
			}
		}, (err, results) => {
			const pack = JSON.parse(Buffer.from(results.body.content, 'base64').toString('utf8'));

			getDependencies(pack, {
				npm: 'http://registry.npmjs.org'
			}, (error, result) => {
				if (error) return res.status(500).send(error);
				let response = JSON.stringify(Object.assign({
					starbuck: result
				}, pack));

				cache.put(`gitlab:${owner}:${repo}`, response, 900000);
				callback(JSON.parse(response));
			});
		});
	}

	get((response) => {
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
	});
});

app.get('/badge/github/:owner/:repo/:status.svg', (req, res) => {
	const allowed = ['dev-status', 'status', 'peer-status'];
	const { owner, repo, status } = req.params;
	if (allowed.indexOf(status) === -1) {
		return res.sendFile(getBadge('unknown', ''), {
			lastModified: false,
			etag: false,
			headers: {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Expires': new Date().toUTCString()
			}
		});
	}

	function get(callback) {
		if (cache.get(`github:${owner}:${repo}`)) {
			callback(JSON.parse(cache.get(`github:${owner}:${repo}`)));
		} else {
			request({
				method: 'GET',
				json: true,
				url: `https://api.github.com/repos/${owner}/${repo}/contents/package.json`,
				headers: {
					'User-Agent': 'request'
				}
			}, (err, results) => {
				const pack = JSON.parse(Buffer.from(results.body.content, 'base64').toString('utf8'));

				getDependencies(pack, {
					npm: 'http://registry.npmjs.org'
				}, (error, result) => {
					if (error) return res.status(500).send(error);
					let response = JSON.stringify(Object.assign({
						starbuck: result
					}, pack));

					cache.put(`github:${owner}:${repo}`, response, 900000);

					callback(JSON.parse(response));
				});
			});
		}
	}

	get((response) => {
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
	});
});

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
	console.log(`starbuck listening at http://localhost:${port}`); // eslint-disable-line
});
