import React from 'react';
import { useHistory } from 'react-router-dom';

import './header.css';

import MenuIcon from '../../icons/menu_icon.svg';
import AccountIcon from '../../icons/account_icon.svg';


export default function Header({ isClickable }) {

	const history = useHistory();

	return (
		<div className="header fade1">
			{isClickable ?
				<div className="clickable logo-place" onClick={() => history.push("/")}>FOODCARD</div>
			: 	<div className="logo-place">FOODCARD</div>}
			<div className="icons">
				<img src={AccountIcon} className="account-icon" alt="Account icon" draggable="false" />
				<img src={MenuIcon} className="menu-icon" alt="Menu icon" draggable="false" />
			</div>
		</div>
	);
}
