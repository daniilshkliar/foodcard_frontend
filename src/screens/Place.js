import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import BeautyStars from 'beauty-stars';
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
                    <div className="place-categories">
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
                    <div className="place-general-review">
                        <div className="place-general-review-row">
                            <div className="place-general-review-overal-rounded">
                                {place.place.general_review.overall}
                            </div>
                            <BeautyStars
                                value={place.place.general_review.overall_rounded}
                                size="20px"
                                gap="4px"
                                inactiveColor="#DADADA"
                                activeColor="#ED6E2D"
                            />
                            <div className="place-general-review-overall-amount">
                                ({place.place.general_review.amount} reviews)
                            </div>
                        </div>
                        <div className="place-general-review-row">
                            <div className="place-general-review-column">
                                <div className="place-general-review-column-header">
                                    Food
                                </div>
                                <div className="place-general-review-column-body">
                                    {place.place.general_review.food}
                                </div>
                            </div>
                            <div className="place-general-review-column">
                                <div className="place-general-review-column-header">
                                    Service
                                </div>
                                <div className="place-general-review-column-body">
                                    {place.place.general_review.service}
                                </div>
                            </div>
                            <div className="place-general-review-column">
                                <div className="place-general-review-column-header">
                                    Ambience
                                </div>
                                <div className="place-general-review-column-body">
                                    {place.place.general_review.ambience}
                                </div>
                            </div>
                            <div className="place-general-review-column">
                                <div className="place-general-review-column-header">
                                    Noise
                                </div>
                                <div className="place-general-review-column-body">
                                    {place.place.general_review.noise}
                                </div>
                            </div>
                        </div>
                        <div className="place-general-review-chart">
                            {place.place.general_review.distribution.map((elem, index) => (
                                <div key={index} className="place-general-review-chart-line">
                                    <div className="place-general-review-chart-line-label">{index + 1}</div>
                                    <div className="place-general-review-chart-line-value">
                                        <div
                                            className="place-general-review-chart-line-progress"
                                            style={{ width: (elem*100)/place.place.general_review.amount + "%" }}
                                        >
                                    </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="place-operation-hours">
                        <div className="place-header">
                            Hours of operation
                        </div>
                        <div className="place-body">
                            {place.place.operation_hours.map((elem, index) => (
                                <div key={index} className="place-operation-hours-row">
                                    <div className="place-weekday">
                                        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][index]}
                                    </div>
                                    <div>{elem[0] + " - " + elem[1]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="place-additional">
                        <div className="place-header">
                            Additional
                        </div>
                        <div className="place-body">
                            {place.place.additional.map((elem, index) => (
                                <div key={index}>
                                    {elem}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}