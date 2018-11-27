import React, { Component } from 'react'
import PropTypes from 'prop-types'

class DependenciesTable extends Component {
  constructor (props) {
    super(props)

    const { selectedTab } = props

    this.state = {
      selected: selectedTab || 'dependencies',
      sort: 'name',
      direction: 1
    }
  }

  changeTab (tab) {
    const { changeTab } = this.props
    if (typeof changeTab === 'function') {
      changeTab(tab)
    }
    this.setState({ selected: tab })
  }

  sort (key, direction, array) {
    if (direction === 1) {
      return array.sort((a, b) => a[key] > b[key] ? -1 : 1)
    } else {
      return array.sort((a, b) => a[key] < b[key] ? -1 : 1)
    }
  }

  setStort (k) {
    const { sort, direction } = this.state
    this.setState({
      sort: k,
      direction: k === sort ? -direction : 1
    })
  }

  render () {
    const { selected, sort, direction } = this.state
    let dependencies = this.props[selected]

    dependencies = Object.keys(dependencies).map((d) => {
      dependencies[d]['name'] = d

      return dependencies[d]
    }, [])

    return (
      <div className='text-center'>
        <div className='btn-group'>
          <button className={`btn ${selected === 'dependencies' ? 'btn-primary' : 'btn-white'}`} onClick={this.changeTab.bind(this, 'dependencies')}>dependencies ({Object.keys(this.props['dependencies']).length})</button>
          <button className={`btn ${selected === 'devDependencies' ? 'btn-primary' : 'btn-white'}`} onClick={this.changeTab.bind(this, 'devDependencies')}>devDependencies ({Object.keys(this.props['devDependencies']).length})</button>
          <button className={`btn ${selected === 'peerDependencies' ? 'btn-primary' : 'btn-white'}`} onClick={this.changeTab.bind(this, 'peerDependencies')}>peerDependencies ({Object.keys(this.props['peerDependencies']).length})</button>
        </div>
        <br />
        <br />
        <table className='table'>
          <thead>
            <tr>
              <th onClick={this.setStort.bind(this, 'name')}>name {sort === 'name' && direction === 1 ? '˄' : sort === 'name' && direction === -1 ? '˅' : ''}</th>
              <th onClick={this.setStort.bind(this, 'required')}>required {sort === 'required' && direction === 1 ? '˄' : sort === 'required' && direction === -1 ? '˅' : ''}</th>
              <th onClick={this.setStort.bind(this, 'stable')}>stable {sort === 'stable' && direction === 1 ? '˄' : sort === 'stable' && direction === -1 ? '˅' : ''}</th>
              <th onClick={this.setStort.bind(this, 'latest')}>latest {sort === 'latest' && direction === 1 ? '˄' : sort === 'latest' && direction === -1 ? '˅' : ''}</th>
              <th onClick={this.setStort.bind(this, 'needsUpdating')}>status {sort === 'needsUpdating' && direction === 1 ? '˄' : sort === 'needsUpdating' && direction === -1 ? '˅' : ''}</th>
            </tr>
          </thead>
          <tbody>
            { dependencies.length > 0
              ? this.sort(sort, direction, dependencies).map((dep, i) => {
                return (<tr key={i}>
                  <td>{dep['name']}</td>
                  <td>{dep['required']}</td>
                  <td>{dep['stable']}</td>
                  <td>{dep['latest']}</td>
                  <td><span className={dep['needsUpdating'] ? 'status-notupdated' : 'status-updated'} /></td>
                </tr>)
              })
              : <tr>
                <td colSpan='5' style={{ 'text-align': 'center', 'height': `${(window.innerHeight / 2)}px` }}> No {selected} Found </td>
              </tr>
            }
          </tbody>
        </table>

      </div>
    )
  }
}

DependenciesTable.propTypes = {
  changeTab: PropTypes.function,
  dependencies: PropTypes.object,
  devDependencies: PropTypes.object,
  peerDependencies: PropTypes.object,
  selectedTab: PropTypes.string
}

export default DependenciesTable
