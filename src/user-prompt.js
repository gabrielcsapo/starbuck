import React, { Component } from 'react'
import {
  withRouter
} from 'react-router-dom'

class UserPrompt extends Component {
  constructor (props) {
    super(props)

    this.state = {
      service: 'github'
    }
  }

  onChange (variable, e) {
    this.setState({
      [variable]: e.target.value
    })
  }

  navigateToUser () {
    const { owner, service } = this.state

    this.props.history.push(`/${service}/${owner}/`)
  }

  render () {
    return (
      <div style={{ borderBottom: '1px solid #dedede' }} className='text-center'>
        <input type='text' placeholder='username' onChange={this.onChange.bind(this, 'owner')} style={{ width: '50%', display: 'inline', marginRight: '5px' }} />
        <select onChange={this.onChange.bind(this, 'service')} style={{ display: 'inline' }}>
          <option name='github'>Github</option>
          <option name='gitlab'>Gitlab</option>
        </select>
        <button style={{ padding: '6px 18px' }} className='btn btn-success' onClick={this.navigateToUser.bind(this)}>go</button>
      </div>
    )
  }
}

export default withRouter(UserPrompt)
