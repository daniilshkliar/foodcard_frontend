import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Home from './screens/Home';
import Gallery from './screens/Gallery';
import Place from './screens/Place';
import Login from './screens/Login';
import Signup from './screens/Signup';
import AccountActivate from './screens/AccountActivate';
import ControlPanel from './screens/ControlPanel';
import NotFound from './screens/NotFound';

import './index.css';
import './auth.css';


const history = createBrowserHistory();
const isAuthenticated = localStorage.getItem('access');

						
ReactDOM.render(
	<Router history={history}>
		<Switch>
			<Route exact path="/">
				<Home />
			</Route>
			{isAuthenticated ? 
				<Redirect from="/login" to="/" /> 
			: 	<Route exact path="/login">
					<Login />
				</Route>
			}
			{isAuthenticated ?
				<Redirect from="/signup" to="/" />
			: 	<Route exact path="/signup">
					<Signup />
				</Route>
			}
			{!isAuthenticated &&
				<Route exact path="/activate/:uid/:token">
					<AccountActivate />
				</Route>
			}
			{isAuthenticated && //isSuperUser or Manager
				<Route exact path="/controlpanel">
					<ControlPanel />
				</Route>
			}
			<Route exact path="/gallery">
				<Gallery />
			</Route>
			<Route exact path="/place/:city/:title">
				<Place />
			</Route>
			<Route exact path="/notfound">
				<NotFound />
			</Route>
			<Route>
				<NotFound />
			</Route>
		</Switch>
	</Router>,
	document.getElementById('root')
);