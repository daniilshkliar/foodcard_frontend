import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Home from './screens/Home';
import Gallery from './screens/Gallery';
import Place from './screens/Place';
import Login from './screens/Login';
import Signup from './screens/Signup';
import AccountActivate from './screens/AccountActivate';
import ControlPanel from './screens/ControlPanel';
import NotFound from './screens/NotFound';
// import Reservation from './screens/Reservation';

import './index.css';
import './auth.css';


const history = createBrowserHistory();

ReactDOM.render(
	<Router history={history}>
		<Switch>
			<Route exact path="/">
				<Home />
			</Route>
			<Route exact path="/login">
				<Login />
			</Route>
			<Route exact path="/signup">
				<Signup />
			</Route>
			<Route exact path="/activate/:uid/:token">
				<AccountActivate />
			</Route>
			<Route exact path="/controlpanel">
				<ControlPanel />
			</Route>
			<Route exact path="/gallery">
				<Gallery />
			</Route>
			<Route exact path="/place/:city/:title">
				<Place />
			</Route>
			{/* <Route exact path="/reservation">
				<Reservation />
			</Route> */}
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