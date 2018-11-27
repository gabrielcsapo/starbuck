import React from 'react'

import { storiesOf } from '@storybook/react'

import DependenciesTable from '../src/dependenciesTable'

storiesOf('DependenciesTable', module)
  .add('DependenciesTable with all types', () => {
    let options = {
      'peerDependencies': {},
      'devDependencies': {
        'eslint-plugin-react': {
          'required': '^7.4.0',
          'stable': '7.4.0',
          'latest': '7.4.0',
          'needsUpdating': false
        },
        'file-loader': {
          'required': '^1.1.5',
          'stable': '1.1.5',
          'latest': '1.1.5',
          'needsUpdating': false
        },
        '@storybook/react': {
          'required': '^3.2.11',
          'stable': '3.2.12',
          'latest': '3.3.0-alpha.2',
          'needsUpdating': true
        },
        'tape': {
          'required': '^4.8.0',
          'stable': '4.8.0',
          'latest': '4.8.0',
          'needsUpdating': false
        },
        'tap': {
          'required': '^10.7.1',
          'stable': '10.7.2',
          'latest': '10.7.2',
          'needsUpdating': false
        },
        'eslint': {
          'required': '^4.7.2',
          'stable': '4.8.0',
          'latest': '4.8.0',
          'needsUpdating': false
        }
      },
      'dependencies': {
        'react': {
          'required': '^16.0.0',
          'stable': '16.0.0',
          'latest': '16.0.0',
          'needsUpdating': false
        },
        'ora': {
          'required': '^1.3.0',
          'stable': '1.3.0',
          'latest': '1.3.0',
          'needsUpdating': false
        },
        'react-router': {
          'required': '^4.1.2',
          'stable': '4.2.0',
          'latest': '3.2.0',
          'needsUpdating': true
        },
        'html-webpack-inline-source-plugin': {
          'required': '0.0.9',
          'stable': '0.0.9',
          'latest': '0.0.9',
          'needsUpdating': false
        },
        'marked': {
          'required': '^0.3.6',
          'stable': '0.3.6',
          'latest': '0.3.6',
          'needsUpdating': false
        },
        'babel-preset-es2015': {
          'required': '^6.24.1',
          'stable': '6.24.1',
          'latest': '7.0.0-beta.2',
          'needsUpdating': true
        },
        'prop-types': {
          'required': '^15.6.0',
          'stable': '15.6.0',
          'latest': '15.6.0',
          'needsUpdating': false
        },
        'babel-preset-react': {
          'required': '^6.24.1',
          'stable': '6.24.1',
          'latest': '7.0.0-beta.2',
          'needsUpdating': true
        },
        'style-loader': {
          'required': '^0.19.0',
          'stable': '0.19.0',
          'latest': '0.19.0',
          'needsUpdating': false
        },
        'babel-loader': {
          'required': '^7.0.0',
          'stable': '7.1.2',
          'latest': '7.1.2',
          'needsUpdating': false
        },
        'react-ace': {
          'required': '^5.2.1',
          'stable': '5.3.0',
          'latest': '5.3.0',
          'needsUpdating': false
        },
        'react-dom': {
          'required': '^16.0.0',
          'stable': '16.0.0',
          'latest': '16.0.0',
          'needsUpdating': false
        },
        'html-webpack-plugin': {
          'required': '^2.30.1',
          'stable': '2.30.1',
          'latest': '2.30.1',
          'needsUpdating': false
        },
        'babel-core': {
          'required': '^6.24.1',
          'stable': '6.26.0',
          'latest': '7.0.0-beta.2',
          'needsUpdating': true
        },
        'brace': {
          'required': '^0.10.0',
          'stable': '0.10.0',
          'latest': '0.10.0',
          'needsUpdating': false
        },
        'webpack': {
          'required': '^3.6.0',
          'stable': '3.6.0',
          'latest': '3.6.0',
          'needsUpdating': false
        },
        'dedent': {
          'required': '^0.7.0',
          'stable': '0.7.0',
          'latest': '0.7.0',
          'needsUpdating': false
        },
        'psychic-ui': {
          'required': '^1.0.8',
          'stable': '1.0.8',
          'latest': '1.0.8',
          'needsUpdating': false
        },
        'commander': {
          'required': '^2.9.0',
          'stable': '2.11.0',
          'latest': '2.11.0',
          'needsUpdating': false
        },
        'css-loader': {
          'required': '^0.28.4',
          'stable': '0.28.7',
          'latest': '0.28.7',
          'needsUpdating': false
        },
        'express': {
          'required': '^4.15.5',
          'stable': '4.16.1',
          'latest': '5.0.0-alpha.6',
          'needsUpdating': true
        }
      }
    }
    return (
      <div style={{ width: '80%', margin: '0 auto', padding: '50px' }}>
        <DependenciesTable {...options} />
      </div>
    )
  })
