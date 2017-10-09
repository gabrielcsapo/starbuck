import React from 'react';
import PropTypes from 'prop-types';
import DependenciesTable from './DependenciesTable';

class Dependencies extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			info: '',
			error: '',
			selectedTab: 'dependencies'
		};
		const { match } = props;
		const { params } = match;
		const { service, owner, repo } = params;

		const url = `/api/${service}/${owner}/${repo}`;

		fetch(url)
			.then((response) => {
				return response.json();
			}).then((info) => {
				this.setState({ info });
			}).catch((error) => {
				this.setState({ error });
			});
	}
	changeTab(tab) {
		this.setState({
			selectedTab: tab
		});
	}
	render() {
		const { match } = this.props;
		const { params } = match;
		const { service, owner, repo } = params;

		const { info={}, selectedTab } = this.state;
		const { name, description, version, starbuck } = info;

		let badge = {
			'devDependencies': 'dev-status',
			'dependencies': 'status',
			'peerDependencies': 'peer-status'
		}[selectedTab];

		document.title = `${repo} v${version || '?'}`;

		// TODO: if there is an error show it nicely
		return (
			<div style={{ width:'60%', margin: '0 auto' }}>
				{ info
					?
					<div>
						<h2> {service}/{owner}/{ name } ({version || 'no version'}) </h2>
						<small> <i> { description || 'no description' } </i> </small>
						<br/>
						<hr/>
						<br/>
						<img src={`/badge/${service}/${owner}/${repo}/${badge}.svg`} style={{ float: 'right', marginTop: '25px' }}/>
						<DependenciesTable {...starbuck} changeTab={this.changeTab.bind(this)}/>
					</div>
					:
					<div className="spinner-overlay center" style={{ 'padding': '10px 0px 10px 0px' }}>
						<div className="spinner-wrapper">
							<div className="spinner spinner-primary"></div>
						</div>
					</div>
				}
			</div>
		);
	}
}

Dependencies.propTypes = {
	match: PropTypes.object
};

export default Dependencies;
