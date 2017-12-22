#!/usr/bin/env node

const path = require('path');
const starbuck = require('../index.js');

const args = process.argv.slice(2);

let program = {};

args.forEach((arg, i) => {
	switch (arg) {
	case '-v':
	case '--version':
	case 'version':
      console.log(`v${require('../package.json').version}`); // eslint-disable-line
		process.exit(0);
		break;
	case '-h':
	case '--help':
	case 'help':
      console.log(`` + // eslint-disable-line
        `
Usage: starbuck [options]

Commands:
  -h, --help, help                Output usage information
  -v, --version, version          Output the version number

Options:
  -c, --config [path]            Specify a config file to override the defaults
  -p, --port [port]            	 Should override the default port
`);
		process.exit(0);
		break;
	case '-c':
	case '--config':
		program['config'] = path.resolve(process.cwd(), args[i + 1]);
		break;
	case '-p':
	case '--port':
		program['port'] = args[i + 1];
		break;
	}
});

const {
	config,
	port = 8000
} = program;

(async function() {
	try {
		await starbuck(config ? require(config) : undefined, port);
	} catch (ex) {
    console.error(`starbuck was unable to start \n ${ex.stack}`); // eslint-disable-line
	}
}());
