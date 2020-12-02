import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import BeautyStars from 'beauty-stars';
import { YMaps, Map, Placemark, ZoomControl } from 'react-yandex-maps';
import ShowMoreText from 'react-show-more-text';
import axios from 'axios';
import Header from '../components/Header/Header';
import Slider from '../components/Slider/Slider';
import EditDescription from '../components/EditForms/EditDescription'

import '../place.css'

import WebsiteIcon from '../icons/website_icon.svg';
import InstagramIcon from '../icons/instagram_icon.svg';
import PhoneIcon from '../icons/phone_icon.svg';

import place from '../place.json';


export default function Place() {

    const history = useHistory();
    const { id } = useParams();
    const [sliderIndex, setSliderIndex] = useState(-1);
    const [isAdmin, setAdmin] = useState(true);

    const [description, setDescription] = useState(place.place.description);
    const [isEditDescription, setEditDescription] = useState(false);
    const [editedDescription, setEditedDescription] = useState(description);


    return (
        <div className="app">
            {sliderIndex!==-1 &&
                <Slider elements={place.place.photos} sliderIndex={sliderIndex} setSliderIndex={setSliderIndex} />
            }
            {isAdmin && isEditDescription &&
                <EditDescription
                    setEditDescription={setEditDescription}
                    editedDescription={editedDescription}
                    setEditedDescription={setEditedDescription}
                    setDescription={setDescription}
                />
            }
            <Header isClickable={true} />
            <div className="main">
                <div className="place-photos">
                    <div className="place-photo-container-1">
                        <div onClick={() => setSliderIndex(0)}><img src={place.place.photos[0]} alt="Photo" draggable="false" className="place-photo" /></div>
                        <div onClick={() => setSliderIndex(1)}><img src={place.place.photos[1]} alt="Photo" draggable="false" className="place-photo" /></div>
                    </div>
                    <div className="place-photo-container-2">
                        <div onClick={() => setSliderIndex(2)}><img src={place.place.photos[2]} alt="Photo" draggable="false" className="place-photo" /></div>
                    </div>
                    <div className="place-photo-container-0">
                        <div onClick={() => setSliderIndex(3)}><img src={place.place.photos[3]} alt="Photo" draggable="false" className="place-photo" /></div>
                    </div>
                    <div className="place-photo-container-3">
                        <div className="place-photo-container-4">
                            <div onClick={() => setSliderIndex(4)}><img src={place.place.photos[4]} alt="Photo" draggable="false" className="place-photo" /></div>
                        </div>
                        <div className="place-photo-container-5">
                            <div onClick={() => setSliderIndex(5)}><img src={place.place.photos[5]} alt="Photo" draggable="false" className="place-photo" /></div>
                            <div onClick={() => setSliderIndex(6)}><img src={place.place.photos[6]} alt="Photo" draggable="false" className="place-photo" /></div>
                        </div>
                    </div>
                </div>
                <div className="place-window">
                    <div className="place-title">
                        {place.place.title}
                    </div>
                    <div className="place-row">
                        <div className="button active-button">Reserve</div>
                        <div className={"favorite" + (place.place.is_favorite ? " active-button" : "")}>❥</div>
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
                        <div className="button">Menu</div>
                        <div className="icon-link"><a href={place.place.website} target="_blank"><img className="website-icon" src={WebsiteIcon} alt="Website icon" /></a></div>
                        <div className="icon-link"><a href={place.place.instagram} target="_blank"><img className="instagram-icon" src={InstagramIcon} alt="Instagram icon" /></a></div>
                        <div className="button invert" onClick={() => window.open("tel:+" + place.place.phone.replace(/[^0-9]/g, ""), "_self")}>
                            <img className="phone-icon" src={PhoneIcon} alt="Phone icon" />
                            {place.place.phone}
                        </div>
                    </div>
                    <div className="place-description-container">
                        <div className="place-header">
                            <div>Description</div>
                            {isAdmin &&
                                <div className="edit-symbol" onClick={() => setEditDescription(!isEditDescription)}>✎</div>
                            }
                        </div>
                        <div className="place-description">
                            <ShowMoreText
                                lines={6}
                                anchorClass='show-more'
                            >
                                {description}
                            </ShowMoreText>
                        </div>
                        <div className="place-reviews">
                            <div className="place-header">
                                Reviews
                            </div>
                            {place.place.reviews.map((review, index) => (
                                <div key={review.id} className="place-review">
                                    <div className="review-user">
                                        <div className={"user-avatar color" + review.id.toString().slice(-1)}>
                                            {review.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="review-username">{review.username}</div>
                                        <div className="review-city">{review.city}</div>
                                        <div className="review-rating">
                                            <BeautyStars
                                                value={review.overall}
                                                size="15px"
                                                gap="3px"
                                                inactiveColor="#DADADA"
                                                activeColor="#ED6E2D"
                                            />
                                        </div>
                                    </div>
                                    <div className="place-review-column">
                                        <div className="review-date">{review.date}</div>
                                        <div className="review-notes">
                                            <div className="place-row">
                                                <div className="place-general-review-column">
                                                    <div className="place-header review">
                                                        Food
                                                    </div>
                                                    <div className="place-general-review-column-body review">
                                                        {review.food}
                                                    </div>
                                                </div>
                                                <div className="place-general-review-column">
                                                    <div className="place-header review">
                                                        Service
                                                    </div>
                                                    <div className="place-general-review-column-body review">
                                                        {review.service}
                                                    </div>
                                                </div>
                                                <div className="place-general-review-column">
                                                    <div className="place-header review">
                                                        Ambience
                                                    </div>
                                                    <div className="place-general-review-column-body review">
                                                        {review.ambience}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="review-text">
                                            <ShowMoreText
                                                lines={2}
                                                anchorClass='show-more'
                                            >
                                                {review.review}
                                            </ShowMoreText>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="place-general-review">
                        <div className="place-row">
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
                        <div className="place-row">
                            <div className="place-general-review-column">
                                <div className="place-header">
                                    Food
                                </div>
                                <div className="place-general-review-column-body">
                                    {place.place.general_review.food}
                                </div>
                            </div>
                            <div className="place-general-review-column">
                                <div className="place-header">
                                    Service
                                </div>
                                <div className="place-general-review-column-body">
                                    {place.place.general_review.service}
                                </div>
                            </div>
                            <div className="place-general-review-column">
                                <div className="place-header">
                                    Ambience
                                </div>
                                <div className="place-general-review-column-body">
                                    {place.place.general_review.ambience}
                                </div>
                            </div>
                            <div className="place-general-review-column">
                                <div className="place-header">
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
                                        {}
                                        <div>{elem[0] + " - " + elem[1]}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="place-address">
                            <div className="place-header">
                                Address
                            </div>
                            <div className="place-body">
                                <div>
                                    {place.place.address.country + ", " + place.place.address.city + ", " + place.place.address.street}
                                </div>
                                <div className="place-map">
                                    <YMaps>
                                        <Map className="main-map" state={{ center: place.place.coordinates, zoom: 12 }}>
                                            <ZoomControl options={{ size: 'small', position: { bottom: 30, right: 10 }}} />
                                            <Placemark
                                                geometry={place.place.coordinates}
                                                options={{ iconColor: 'red' }}
                                            />
                                        </Map>
                                    </YMaps>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}