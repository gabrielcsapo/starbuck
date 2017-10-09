const path = require('path');

module.exports.getBadge = function getBadge(status, type) {
	const badgePath = path.resolve(__dirname, '..', 'dist', 'img', 'status');

	type = type ? type + '-' : '';
	const style = '-flat-square';
	const extension = 'svg';

	return path.join(badgePath, `${type}${status}${style}.${extension}`);
};
