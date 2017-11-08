import React from 'react';

class Main extends React.Component {
	render () {
		return (
			<div className="center">
				<img src="/logo.svg" style={{ 'display': 'inline-block', 'width': '35px' }}/>
				<h3 className="text-black">&nbsp;STARBUCK</h3>
				<small>NPM dependency tracking server</small>
				<br/>
				<br/>
				<a className="btn" href="https://github.com/gabrielcsapo/starbuck" target="_blank" rel="noopener noreferrer">Source</a>
				<a className="btn" href="https://github.com/gabrielcsapo/starbuck/releases" target="_blank" rel="noopener noreferrer">Releases</a>
			</div>
		);
	}
}

export default Main;
