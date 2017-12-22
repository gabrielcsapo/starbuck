import React from 'react';

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			exampleLink: `${location.href}badge/:service/:repo/:type.svg`
		};
	}
	toggleLink(link) {
		this.setState({
			exampleLink: typeof link == 'string' ? link : `${location.href}badge/:service/:repo/:type.svg`
		});
	}
	render () {
		const { exampleLink } = this.state;
		const { location } = document;

		return (
			<div className="center">
				<img src="/logo.svg" style={{ 'display': 'inline-block', 'width': '35px' }}/>
				<h3 className="text-black">&nbsp;STARBUCK</h3>
				<small>NPM dependency tracking server</small>
				<br/>
				<pre>
					&lt;img src={exampleLink}/&gt;
				</pre>
				<a style={{ paddingRight: '2px' }} href="/github/gabrielcsapo/starbuck" onMouseEnter={this.toggleLink.bind(this, `${location.href}badge/github/gabrielcsapo/dev-status.svg`)} onMouseLeave={this.toggleLink.bind(this)}>
					<img src="/badge/github/gabrielcsapo/starbuck/dev-status.svg"/>
				</a>
				<a style={{ paddingRight: '2px' }} href="/github/gabrielcsapo/starbuck" onMouseEnter={this.toggleLink.bind(this, `${location.href}badge/github/gabrielcsapo/status.svg`)} onMouseLeave={this.toggleLink.bind(this)}>
					<img src="/badge/github/gabrielcsapo/starbuck/status.svg"/>
				</a>
				<a style={{ paddingRight: '2px' }} href="/github/gabrielcsapo/starbuck" onMouseEnter={this.toggleLink.bind(this, `${location.href}badge/github/gabrielcsapo/peer-status.svg`)} onMouseLeave={this.toggleLink.bind(this)}>
					<img src="/badge/github/gabrielcsapo/starbuck/peer-status.svg"/>
				</a>
				<br/>
				<a className="btn" href="https://github.com/gabrielcsapo/starbuck" target="_blank" rel="noopener noreferrer">Source</a>
				<a className="btn" href="https://github.com/gabrielcsapo/starbuck/releases" target="_blank" rel="noopener noreferrer">Releases</a>
			</div>
		);
	}
}

export default Main;
