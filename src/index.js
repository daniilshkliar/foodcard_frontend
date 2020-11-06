import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Home from './screens/Home';
import Gallery from './screens/Gallery';
import Place from './screens/Place';
import Login from './screens/Login';
import Signup from './screens/Signup';

import './index.css';
import './auth.css';


const history = createBrowserHistory();

ReactDOM.render(
	<Router history={history}>
		<Route exact path="/">
			<Home />
        </Route>
		<Route exact path="/login">
			<Login />
        </Route>
		<Route exact path="/signup">
			<Signup />
        </Route>
		<Route exact path="/gallery">
			<Gallery />
        </Route>
		<Route exact path="/place/:id">
			<Place />
        </Route>
	</Router>,
	document.getElementById('root')
);