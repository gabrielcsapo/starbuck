import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Layout extends Component {
  render () {
    const { children } = this.props

    return (
      <div>
        <div className='navbar'>
          <div className='container'>
            <div className='navbar-title'>
              <a className='text-black' href='/' style={{ 'width': '120px' }}>
                <img src='/logo.svg' style={{ 'display': 'inline-block', 'width': '35px' }} />
              </a>
            </div>
          </div>
        </div>
        <div className='content'>
          { children }
        </div>
      </div>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.object
}

export default Layout
