#!/usr/bin/env node

const path = require('path')
const woof = require('woof')
const starbuck = require('../index.js')

const cli = woof(`
  Usage: starbuck [options]

  Commands:
    -h, --help, help                Output usage information
    -v, --version, version          Output the version number

  Options:
    -c, --config [path]             Specify a config file to override the defaults
    -p, --port [port]               Should override the default port
`, {
  flags: {
    config: {
      default: '',
      alias: 'c'
    },
    port: {
      default: process.env.PORT || 8000,
      alias: 'p'
    }
  }
})

if (cli.help || cli.version) process.exit(0)

if (cli.config) {
  cli.config = require(path.resolve(process.cwd(), cli.config))
}

(async function () {
  try {
    await starbuck(cli.config || {}, cli.port)
  } catch (ex) {
    console.error(`starbuck was unable to start \n ${ex.stack}`); // eslint-disable-line
  }
}())
