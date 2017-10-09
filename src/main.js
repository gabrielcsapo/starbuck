import React from 'react';

class Main extends React.Component {
	render () {
		return (
			<div className="center">
				<img src="/img/logo.svg" style={{ 'display': 'inline-block', 'width': '35px' }}/>
				<h3 className="text-black">&nbsp;STARBUCK</h3>
				<small>NPM dependency tracking server</small>
			</div>
		);
	}
}

export default Main;
