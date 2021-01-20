import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Header from '../components/Header/Header';

import '../panel.css';


export default function ControlPanel({  }) {
    const history = useHistory();
    const [isAccountBarActive, setAccountBarActive] = useState(false);
    const [isAuthenticated, setAuthenticated] = useState(localStorage.getItem('access'));

	return (
        <div className="app">
            <Header isClickable={true} />
			
		</div>
	);
}
