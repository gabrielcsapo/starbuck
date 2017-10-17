const request = require('request');

module.exports = function(options) {
	const { url, token } = options;

	let headers = {
		'User-Agent': 'request'
	};

	if (token) {
		headers['PRIVATE-TOKEN'] = token;
	}

	return {
		getPackage: function getPackage(owner, repo) {
			return new Promise(function(resolve, reject) {
				const id = encodeURIComponent(`${owner}/${repo}`);

				request({
					method: 'GET',
					json: true,
					url: `${url}/v3/projects/${id}/repository/files/package.json?ref=master`,
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
					url: `${url}/v4/users/${owner}/projects`,
					headers
				}, (err, results) => {
					if (err) return reject(err);

					if (Array.isArray(results.body)) {
						return resolve(results.body.map((repo) => {
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
