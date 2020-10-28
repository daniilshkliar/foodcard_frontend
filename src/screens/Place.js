import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import axios from 'axios';

import '../place.css'

import ArrowDownIcon from '../icons/arrow_down_icon.svg';
import ArrowUpIcon from '../icons/arrow_up_icon.svg';
import WebsiteIcon from '../icons/website_icon.svg';
import InstagramIcon from '../icons/instagram_icon.svg';
import PhoneIcon from '../icons/phone_icon.svg';

import place from '../place.json';


export default function Place() {

    const history = useHistory();
    const params = useParams();
    const [isDescriptionExpand, setDescriptionExpand] = useState(false);


    return (
        <div className="app">
            <Header isClickable={true} />
            <div className="main">
                <div className="place-photos">
                    <div className="place-photo-container-1">
                        <div><img src={place.place.photos[0]} alt="Photo" draggable="false" className="place-photo" /></div>
                        <div><img src={place.place.photos[1]} alt="Photo" draggable="false" className="place-photo" /></div>
                    </div>
                    <div className="place-photo-container-2">
                        <div><img src={place.place.photos[2]} alt="Photo" draggable="false" className="place-photo" /></div>
                    </div>
                    <div className="place-photo-container-0">
                        <div><img src={place.place.photos[3]} alt="Photo" draggable="false" className="place-photo" /></div>
                    </div>
                    <div className="place-photo-container-3">
                        <div className="place-photo-container-4">
                            <div><img src={place.place.photos[4]} alt="Photo" draggable="false" className="place-photo" /></div>
                        </div>
                        <div className="place-photo-container-5">
                            <div><img src={place.place.photos[5]} alt="Photo" draggable="false" className="place-photo" /></div>
                            <div><img src={place.place.photos[6]} alt="Photo" draggable="false" className="place-photo" /></div>
                        </div>
                    </div>
                </div>
                <div className="place-window">
                    <div className="place-title">
                        {place.place.title}
                    </div>
                    <div className="place-gategories">
                        {place.place.categories.map((elem, index) => (
                            <div key={index} className="place-category">
                                {elem}
                                {index !== (place.place.categories.length - 1) && <div class="dot"></div>}
                            </div>
                        ))}
                    </div>
                    <div className="place-cuisines">
                        {place.place.cuisines.map((elem, index) => (
                            <div key={index} className="place-cuisine">
                                {elem}
                                {index !== (place.place.cuisines.length - 1) && <div class="dot"></div>}
                            </div>
                        ))}
                    </div>
                    <div className="place-dashboard">
                        <div className="button place-reservation">Reserve</div>
                        <div className="button place-menu">Menu</div>
                        <div className="icon-link"><a href={place.place.website} target="_blank"><img className="website-icon" src={WebsiteIcon} alt="Website icon" /></a></div>
                        <div className="icon-link"><a href={place.place.instagram} target="_blank"><img className="instagram-icon" src={InstagramIcon} alt="Instagram icon" /></a></div>
                        <div className="button place-phone invert" onClick={() => window.open("tel:+" + place.place.phone.replace(/[^0-9]/g, ""), "_self")}>
                            <img className="phone-icon" src={PhoneIcon} alt="Phone icon" />
                            {place.place.phone}
                        </div>
                    </div>
                    <div className="place-description-container">
                        <div className={"place-description" + (isDescriptionExpand ? " expanded" : "")}>
                            {place.place.description}
                        </div>
                        <div className="invert expand-arrow clickable" onClick={() => setDescriptionExpand(!isDescriptionExpand)}>
                            {isDescriptionExpand ?
                            <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                            : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}