import React, { useState } from 'react';
import axios from 'axios';


export default function EditDescription({ 

 }) {


    const fetchCountryCoordinates = async (country) => {

        const data = await axios(
            "https://geocode-maps.yandex.ru/1.x/?apikey=d08fc50d-a7e6-4f37-bc51-1eb5df129e9d&format=json&geocode=" + country
        );
        setCoordinates([...data.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(el => parseInt(el)).reverse()]);
    };


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
