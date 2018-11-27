import React, { Component } from 'react'
import PropTypes from 'prop-types'

class User extends Component {
  constructor (props) {
    super(props)
    // to work with mocks
    if (props['repos'] && props['service'] && props['owner']) {
      this.state = {
        repos: props['repos'],
        service: props['service'],
        owner: props['owner'],
        loading: false,
        error: ''
      }
      return
    }

    const { match } = props
    const { params } = match
    const { service, owner } = params

    this.state = {
      service,
      owner,
      repos: [],
      loading: false,
      error: ''
    }

    const url = `/api/${service}/${owner}/repos`

    fetch(url)
      .then((response) => {
        return response.json()
      })
      .then((repos) => {
        if (repos.error) {
          this.setState({
            error: repos.error,
            loading: false
          })
        } else {
          this.setState({
            repos,
            loading: false
          })
        }
      })
      .catch((error) => {
        this.setState({
          error,
          loading: false
        })
      })
  }
  render () {
    const { repos, loading, error, service, owner } = this.state

    if (loading) {
      return (<div style={{ 'textAlign': 'center', 'width': '100%', 'position': 'absolute', 'top': '50%', 'transform': 'translateY(-50%)' }}>
				Loading...
      </div>)
    }

    if (error) {
      return (<div style={{ 'textAlign': 'center', 'width': '100%', 'position': 'absolute', 'top': '50%', 'transform': 'translateY(-50%)' }}>
        { error }
      </div>)
    }

    // TODO: if there is an error show it nicely
    return (<div style={{ width: '90%', margin: '0 auto' }}>
      <div className='grid'>
        <div className='col-12-12'>
          <h2> {service}/{owner} </h2>
          <ul className='list'>
            { repos.map((repo, i) => {
              const { description, name } = repo
              return (<li key={`${name}/${i}`} className='list-item'>
                <a href={`/${service}/${owner}/${name}`}>
                  <h3 style={{ 'padding': 0, 'margin': 0 }}>{ name }</h3>
                  <small>{ description }</small>
                </a>
              </li>)
            })}
          </ul>
        </div>
      </div>
    </div>)
  }
}

User.propTypes = {
  match: PropTypes.object,
  repos: PropTypes.array,
  service: PropTypes.string,
  owner: PropTypes.string
}

export default User
