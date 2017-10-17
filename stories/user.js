import React from 'react';

import { storiesOf } from '@storybook/react';

import User from '../src/user';

storiesOf('User', module)
	.add('DependenciesTable with all types', () => {
		let repos = [{
			'name': 'bluse',
			'description': '⚗️ blend and fuse data with ease'
		}, {
			'name': 'build.sh',
			'description': '🔨 run and visualize the build process'
		}, {
			'name': 'compress-object',
			'description': 'when objects become too large, let\'s turn them into something smaller'
		}, {
			'name': 'cproxy',
			'description': '⚡️A high speed proxy cache for all things http '
		}, {
			'name': 'deploy.sh',
			'description': '☁️ continuous deployment services'
		}, {
			'name': 'dobby',
			'description': 'Dobby is an abstraction of cocoa widgets into a python setting.'
		}, {
			'name': 'electron-mobile',
			'description': 'a work in progress iOS/android compatible build target for electron'
		}, {
			'name': 'espyjs',
			'description': 'have you ever wondered what happens when you code starts to run?'
		}, {
			'name': 'gabrielcsapo.github.io',
			'description': 'personal website '
		}, {
			'name': 'gh-manager',
			'description': 'A github project manager for organizations and personal accounts'
		}, {
			'name': 'gh-metrics',
			'description': 'a cli to track github stats across different users github repos'
		}, {
			'name': 'git-timesince',
			'description': '⏰ a simple extension of git that shows the time since the last commit'
		}, {
			'name': 'git-unstaged',
			'description': '🎭 Get all unstaged git repos in a folder'
		}, {
			'name': 'json-ex',
			'description': 'Extends JSON to be able to serialize and deserialize more than just basic primitives'
		}, {
			'name': 'lcov-server',
			'description': '🎯 A simple lcov server & cli parser'
		}, {
			'name': 'mocha-markdown-extended-reporter',
			'description': 'A simple mocha markdown reporter'
		}, {
			'name': 'monotime',
			'description': '💰 Money is time, a library to figure out what your time costs'
		}, {
			'name': 'node-chat-rooms',
			'description': '🐒 open chat rooms for the masses'
		}, {
			'name': 'node-dashboard',
			'description': 'an express plugin to show route traffic'
		}, {
			'name': 'node-document-parser',
			'description': 'a library / server for parsing documents'
		}];

		return (
			<div style={{ width: '80%', margin: '0 auto', padding: '50px' }}>
				<User service={'github'} owner={'gabrielcsapo'} repos={repos}/>
			</div>
		);
	});
