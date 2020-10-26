import React from 'react';
import { useHistory } from 'react-router-dom';

import './header.css';

import FullLogo from '../../pictures/full_logo.svg';
import MenuIcon from '../../icons/menu_icon.svg';
import AccountIcon from '../../icons/account_icon.svg';


export default function Header({ isClickable }) {

	const history = useHistory();

	return (
		<div className="header fade1">
			<div className="logo-place">
				{isClickable ?
					<img src={FullLogo} alt="Full logo" draggable="false" onClick={() => history.push("/")} className="clickable" />
				: 	<img src={FullLogo} alt="Full logo" draggable="false" />}
			</div>
			<div className="icons">
				<img src={AccountIcon} className="account-icon" alt="Account icon" draggable="false" />
				<img src={MenuIcon} className="menu-icon" alt="Menu icon" draggable="false" />
			</div>
		</div>
	);
}
