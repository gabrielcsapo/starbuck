import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Layout from './layout';
import Main from './main';
import Dependencies from './Dependencies';

export default (
	<BrowserRouter>
		<Layout>
			<Switch>
				<Route exact path='/' component={ Main }/>
				<Route exact path='/:service/:owner/:repo' component={ Dependencies }/>
			</Switch>
		</Layout>
	</BrowserRouter>
);
