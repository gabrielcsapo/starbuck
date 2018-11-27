import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Layout from './layout'
import Main from './main'
import User from './user'
import Dependencies from './dependencies'

export default (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route exact path='/' component={Main} />
        <Route exact path='/:service/:owner/' component={User} />
        <Route exact path='/:service/:owner/:repo/:selectedTab?' component={Dependencies} />
      </Switch>
    </Layout>
  </BrowserRouter>
)
