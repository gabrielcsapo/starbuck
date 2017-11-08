#!/usr/bin/env node

const pkg = require('../package.json');
const program = require('commander');

program
	.version(pkg.version)
	.option('-c, --config [config]', 'Specify a config file to override the defaults')
	.parse(process.argv);

const { config } = program;

if(config) {
	process.env.CONFIG = config;
}

require('../index.js');
