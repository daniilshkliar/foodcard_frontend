import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { YMaps, Map, Placemark, ZoomControl } from 'react-yandex-maps';
import BeautyStars from 'beauty-stars';
import ShowMoreText from 'react-show-more-text';
import moment from 'moment-timezone';

import jwt_axios from '../services/JWTaxios';
import Spinner from '../components/LoaderSpinner/Spinner';
import Header from '../components/Header/Header';
import Slider from '../components/Slider/Slider';
import NotFound from './NotFound';

import '../place.css';

import WebsiteIcon from '../icons/website_icon.svg';
import InstagramIcon from '../icons/instagram_icon.svg';
import PhoneIcon from '../icons/phone_icon.svg';


export default function Place() {
    const history = useHistory();
    const { city, title } = useParams();
    const [sliderIndex, setSliderIndex] = useState(-1);
    const [isFavorite, setFavorite] = useState(false);
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const [place, setPlace] = useState({});

    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);

    let day = new Date().getDay() - 1;
    if (day === -1) day = 6;

    useEffect(() => {
        getPlace();
        getFavorite();
    }, []);

    const getPlace = async () => {
        setLoading(true);
        setMessages({});

        await axios.get("/core/place/get/" + city + "/" + title + "/"
        ).then((response) => {
            setPlace(response.data);
        }).catch((error) => {
            error.response.status === 404 && setNotFound(true);
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response ||
                error.toString()
            );
        }).finally(() => {
            setLoading(false);
        });
    }

    const getFavorite = async () => {
        await jwt_axios.get("/core/favorite/get/", {
            withCredentials: true
        }).then((response) => {
            setAuthenticated(true);
            setFavorite(response.data.places.find(el => el.title === title && el.address.city === city));
        }).catch((error) => {
            setAuthenticated(error.response.status !== 400);
        });
    }

    const handleFavorite = async () => {
        setFavorite(!isFavorite);
        await jwt_axios.post("/core/favorite/handle/" + place.id + "/", { withCredentials: true });
    }

    return (
        <div>
            {notFound ?
                <NotFound />
            :   <div className="app">
                    <Header isClickable={true} />
                    {isLoading ?
                        <Spinner fixed={true} />
                    :   (messages.statusText ?
                            <div className="account-bar">
                                <div className="auth-error">
                                    {messages.statusText}
                                </div>
                            </div>
                        :   <div>
                                {sliderIndex!==-1 && place.photos.length > 0 &&
                                    <Slider elements={[...place.photos.map(elem => elem.image_uri)]} sliderIndex={sliderIndex} setSliderIndex={setSliderIndex} />
                                }
                                
                                <div className="main">
                                    <div className="place-photos">
                                        <div className="place-photo-container-1">
                                            <div className="color0" onClick={() => setSliderIndex(0)}>
                                                {place.photos && place.photos[0] && <img src={place.photos[0].image_uri} alt="Photo" draggable="false" className="place-photo" />}
                                            </div>
                                            <div className="color1" onClick={() => setSliderIndex(1)}>
                                                {place.photos && place.photos[1] && <img src={place.photos[1].image_uri} alt="Photo" draggable="false" className="place-photo" />}
                                            </div>
                                        </div>
                                        <div className="place-photo-container-2">
                                            <div className="color2" onClick={() => setSliderIndex(2)}>
                                                {place.photos && place.photos[2] && <img src={place.photos[2].image_uri} alt="Photo" draggable="false" className="place-photo" />}
                                            </div>
                                        </div>
                                        <div className="place-photo-container-0">
                                            <div className="color3" onClick={() => setSliderIndex(3)}>
                                                {place.photos && place.photos[3] && <img src={place.photos[3].image_uri} alt="Photo" draggable="false" className="place-photo" />}
                                            </div>
                                        </div>
                                        <div className="place-photo-container-3">
                                            <div className="place-photo-container-4">
                                                <div className="color4" onClick={() => setSliderIndex(4)}>
                                                    {place.photos && place.photos[4] && <img src={place.photos[4].image_uri} alt="Photo" draggable="false" className="place-photo" />}
                                                </div>
                                            </div>
                                            <div className="place-photo-container-5">
                                                <div className="color5" onClick={() => setSliderIndex(5)}>
                                                    {place.photos && place.photos[5] && <img src={place.photos[5].image_uri} alt="Photo" draggable="false" className="place-photo" />}
                                                </div>
                                                <div className="color6" onClick={() => setSliderIndex(6)}>
                                                    {place.photos && place.photos[6] && <img src={place.photos[6].image_uri} alt="Photo" draggable="false" className="place-photo" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="place-window">
                                        <div className="place-title">
                                            {place.title}
                                        </div>
                                        <div className="place-row">
                                            <div className="button active-button" onClick={() => history.push("/reservation/" + city + "/" + title + "/")}>Reserve</div>
                                            {isAuthenticated &&
                                                <div className={"favorite" + (isFavorite ? " active-button" : "")} onClick={() => handleFavorite()}>❥</div>
                                            }
                                        </div>
                                        <div className="place-categories">
                                            {place.categories && place.categories.map((elem, index) => (
                                                <div key={index} className="place-category">
                                                    {elem}
                                                    {index !== (place.categories.length - 1) && <div class="dot"></div>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="place-cuisines">
                                            {place.cuisines && place.cuisines.map((elem, index) => (
                                                <div key={index} className="place-cuisine">
                                                    {elem}
                                                    {index !== (place.cuisines.length - 1) && <div class="dot"></div>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="place-dashboard">
                                            <div className="button">Menu</div>
                                            {place.website &&
                                                <div className="icon-link"><a href={place.website} target="_blank"><img className="website-icon" src={WebsiteIcon} alt="Website icon" /></a></div>
                                            }
                                            {place.instagram &&
                                                <div className="icon-link"><a href={place.instagram} target="_blank"><img className="instagram-icon" src={InstagramIcon} alt="Instagram icon" /></a></div>
                                            }
                                            <div className="button invert" onClick={() => window.open("tel:+" + place.phone.replace(/[^0-9]/g, ""), "_self")}>
                                                <img className="phone-icon" src={PhoneIcon} alt="Phone icon" />
                                                {place.phone}
                                            </div>
                                        </div>
                                        <div className="place-description-container">
                                            <div className="place-header">
                                                <div>Description</div>
                                            </div>
                                            <div className="place-description">
                                                <ShowMoreText
                                                    lines={6}
                                                    anchorClass='show-more'
                                                >
                                                    {place.description}
                                                </ShowMoreText>
                                            </div>
                                            <div className="place-reviews">
                                                <div className="place-header">
                                                    Reviews
                                                </div>
                                                {place.reviews && place.reviews.map((review, index) => (
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
                                                    {place.general_review && place.general_review.rating}
                                                </div>
                                                <BeautyStars
                                                    value={place.rounded_rating}
                                                    size="20px"
                                                    gap="4px"
                                                    inactiveColor="#DADADA"
                                                    activeColor="#ED6E2D"
                                                />
                                                <div className="place-general-review-overall-amount">
                                                    ({place.general_review && place.general_review.amount} reviews)
                                                </div>
                                            </div>
                                            {place.general_review && place.general_review.amount > 0 &&
                                                <div>
                                                    <div className="place-row">
                                                        <div className="place-general-review-column">
                                                            <div className="place-header">
                                                                Food
                                                            </div>
                                                            <div className="place-general-review-column-body">
                                                                {place.general_review.food}
                                                            </div>
                                                        </div>
                                                        <div className="place-general-review-column">
                                                            <div className="place-header">
                                                                Service
                                                            </div>
                                                            <div className="place-general-review-column-body">
                                                                {place.general_review.service}
                                                            </div>
                                                        </div>
                                                        <div className="place-general-review-column">
                                                            <div className="place-header">
                                                                Ambience
                                                            </div>
                                                            <div className="place-general-review-column-body">
                                                                {place.general_review.ambience}
                                                            </div>
                                                        </div>
                                                        <div className="place-general-review-column">
                                                            <div className="place-header">
                                                                Noise
                                                            </div>
                                                            <div className="place-general-review-column-body">
                                                                {place.general_review.noise}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="place-general-review-chart">
                                                        {place.general_review && place.general_review.distribution && place.general_review.distribution.map((elem, index) => (
                                                            <div key={index} className="place-general-review-chart-line">
                                                                <div className="place-general-review-chart-line-label">{index + 1}</div>
                                                                <div className="place-general-review-chart-line-value">
                                                                    <div
                                                                        className="place-general-review-chart-line-progress"
                                                                        style={{ width: (elem*100)/place.general_review.amount + "%" }}
                                                                    >
                                                                </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            }
                                            <div className="place-additional">
                                                <div className="place-header">
                                                    Additional services
                                                </div>
                                                <div className="place-body">
                                                    {place.additional_services && place.additional_services.map((elem, index) => (
                                                        <div key={index}>
                                                            {elem}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="place-opening-hours">
                                                <div className="place-header">
                                                    Hours of opening
                                                </div>
                                                <div className="place-body">
                                                    {place.opening_hours && place.opening_hours.map((elem, index) => (
                                                        <div key={index} className="place-opening-hours-row">
                                                            <div className="place-weekday">
                                                                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][index]}
                                                            </div>
                                                            {index === day && <div className="orange-dot"></div>}
                                                            <div>
                                                                {moment.tz(elem[0], place.timezone).format("HH:mm")
                                                                + " - " + 
                                                                moment.tz(elem[1], place.timezone).format("HH:mm")}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="place-address">
                                                <div className="place-header">
                                                    Address
                                                </div>
                                                {place.address && place.address.country && place.address.city && place.address.street && place.address.coordinates &&
                                                    <div className="place-body">
                                                        <div>
                                                            {place.address.country + ", " + place.address.city + ", " + place.address.street}
                                                        </div>
                                                        <div className="place-map">
                                                            <YMaps>
                                                                <Map className="main-map" state={{ center: [place.address.coordinates[0], place.address.coordinates[1]], zoom: 12 }}>
                                                                    <ZoomControl options={{ size: 'small', position: { bottom: 30, right: 10 }}} />
                                                                    <Placemark
                                                                        geometry={[place.address.coordinates[0], place.address.coordinates[1]]}
                                                                        options={{ iconColor: 'red' }}
                                                                    />
                                                                </Map>
                                                            </YMaps>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>                          
            }
        </div>
    );
}