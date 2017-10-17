import React from 'react';
import PropTypes from 'prop-types';

class DependenciesTable extends React.Component {
	constructor(props) {
		super(props);

		const { selectedTab } = props;

		this.state = {
			selected: selectedTab || 'dependencies',
			sort: 'name',
			direction: 1
		};
	}
	changeTab(tab) {
		const { changeTab } = this.props;
		if(typeof changeTab === 'function') {
			changeTab(tab);
		}
		this.setState({ selected: tab });
	}
	sort(key, direction, array) {
		if(direction == 1) {
			return array.sort((a, b) => a[key] > b[key] ? -1 : 1);
		} else {
			return array.sort((a, b) => a[key] < b[key] ? -1 : 1);
		}
	}
	setStort(k) {
		const { sort, direction } = this.state;
		this.setState({
			sort: k,
			direction: k === sort ? -direction : 1
		});
	}
	render () {
		const { selected, sort, direction } = this.state;
		let dependencies = this.props[selected];

		dependencies = Object.keys(dependencies).map((d) => {
			dependencies[d]['name'] = d;

			return dependencies[d];
		}, []);

		return (
			<div>
				<div className="tab">
					<button className={`tablinks ${selected === 'dependencies' ? 'active' : ''}`} onClick={this.changeTab.bind(this, 'dependencies')}>dependencies ({Object.keys(this.props['dependencies']).length})</button>
					<button className={`tablinks ${selected === 'devDependencies' ? 'active' : ''}`} onClick={this.changeTab.bind(this, 'devDependencies')}>devDependencies ({Object.keys(this.props['devDependencies']).length})</button>
					<button className={`tablinks ${selected === 'peerDependencies' ? 'active' : ''}`} onClick={this.changeTab.bind(this, 'peerDependencies')}>peerDependencies ({Object.keys(this.props['peerDependencies']).length})</button>
				</div>
				<br/>
				<br/>
				<table className="table responsive">
					<thead>
						<tr>
							<th onClick={this.setStort.bind(this, 'name')}>name {'name' == sort && direction == 1 ? '˄' : 'name' == sort && direction == -1 ? '˅' : ''}</th>
							<th onClick={this.setStort.bind(this, 'required')}>required {'required' == sort && direction == 1 ? '˄' : 'required' == sort && direction == -1 ? '˅' : ''}</th>
							<th onClick={this.setStort.bind(this, 'stable')}>stable {'stable' == sort && direction == 1 ? '˄' : 'stable' == sort && direction == -1 ? '˅' : ''}</th>
							<th onClick={this.setStort.bind(this, 'latest')}>latest {'latest' == sort && direction == 1 ? '˄' : 'latest' == sort && direction == -1 ? '˅' : ''}</th>
							<th onClick={this.setStort.bind(this, 'needsUpdating')}>status {'needsUpdating' == sort && direction == 1 ? '˄' : 'needsUpdating' == sort && direction == -1 ? '˅' : ''}</th>
						</tr>
					</thead>
					<tbody>
						{ dependencies.length > 0
							?
							this.sort(sort, direction, dependencies).map((dep, i) => {
								return (<tr key={i}>
									<td>{dep['name']}</td>
									<td>{dep['required']}</td>
									<td>{dep['stable']}</td>
									<td>{dep['latest']}</td>
									<td><span className={ dep['needsUpdating'] ? 'status-notupdated' : 'status-updated' }></span></td>
								</tr>);
							})
							:
							<tr>
								<td colSpan="5" style={{ 'text-align': 'center', 'height': `${(window.innerHeight / 2)}px` }}> No Entries Found </td>
							</tr>
						}
					</tbody>
				</table>

			</div>
		);
	}
}

DependenciesTable.propTypes = {
	changeTab: PropTypes.function,
	dependencies: PropTypes.object,
	devDependencies: PropTypes.object,
	peerDependencies: PropTypes.object,
	selectedTab: PropTypes.string
};

export default DependenciesTable;
