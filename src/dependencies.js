import React from 'react';
import PropTypes from 'prop-types';
import DependenciesTable from './DependenciesTable';

class Dependencies extends React.Component {
	constructor(props) {
		super(props);
		const { match } = props;
		const { params } = match;
		const { service, owner, repo, selectedTab } = params;

		this.state = {
			info: {},
			error: '',
			loading: true,
			selectedTab: selectedTab || 'dependencies'
		};

		const url = `/api/${service}/${owner}/${repo}`;

		fetch(url)
			.then((response) => {
				return response.json();
			})
			.then((info) => {
				if(info.error) {
					this.setState({
						error: info.error,
						loading: false
					});
				} else {
					this.setState({
						info,
						loading: false
					});
				}
			})
			.catch((error) => {
				this.setState({
					error,
					loading: false
				});
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

		const { info, selectedTab, error, loading } = this.state;

		if(loading) {
			return (<div style={{ 'textAlign': 'center', 'width': '100%', 'position': 'absolute', 'top':'50%', 'transform': 'translateY(-50%)' }}>
				Loading...
			</div>);
		}

		if(error) {
			return (<div style={{ 'textAlign': 'center', 'width': '100%', 'position': 'absolute', 'top':'50%', 'transform': 'translateY(-50%)' }}>
				{ error }
			</div>);
		}

		const { name, description, version, starbuck } = info;

		let badge = {
			'devDependencies': 'dev-status',
			'dependencies': 'status',
			'peerDependencies': 'peer-status'
		}[selectedTab];

		document.title = `${repo} v${version || '?'}`;

		return (
			<div style={{ width:'60%', margin: '0 auto' }}>
				{ info
					?
					<div>
						<h2> <a href={ `/${service}/${owner}` }>{service}/{owner}</a>/{ name } ({version || 'no version'}) </h2>
						<small> <i> { description || 'no description' } </i> </small>
						<br/>
						<hr/>
						<br/>
						<img src={`/badge/${service}/${owner}/${repo}/${badge}.svg`} style={{ float: 'right', marginTop: '25px' }}/>
						<DependenciesTable {...starbuck} selectedTab={selectedTab} changeTab={this.changeTab.bind(this)}/>
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
	match: PropTypes.object,
	selectedTab: PropTypes.string
};

export default Dependencies;
