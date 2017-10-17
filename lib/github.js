const request = require('request');

module.exports = function(options) {
	const { url, token } = options;

	let headers = {
		'User-Agent': 'request',
	};
	if (token) {
		headers['Authorization'] = `token ${token}`;
	}

	return {
		getPackage: function getPackage(owner, repo) {
			return new Promise(function(resolve, reject) {
				request({
					method: 'GET',
					json: true,
					url: `${url}/repos/${owner}/${repo}/contents/package.json`,
					headers
				}, (err, results) => {
					if (err) return reject(err);

					if (results.body && results.body.content) {
						return resolve(JSON.parse(Buffer.from(results.body.content, 'base64').toString('utf8')));
					} else {
						return reject(`Could not find package.json in ${repo}`);
					}
				});
			});
		},
		getRepos: function getRepos(owner) {
			return new Promise(function(resolve, reject) {
				request({
					method: 'GET',
					json: true,
					url: `${url}/users/${owner}/repos`,
					headers
				}, (err, results) => {
					if (err) return reject(err);

					if (Array.isArray(results.body)) {
						return resolve(results.body.filter((repo) => !repo.fork).map((repo) => {
							return {
								name: repo.name,
								description: repo.description
							};
						}));
					} else {
						return reject(`User ${owner} not found`);
					}
				});
			});
		}
	};
};
