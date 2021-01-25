import React, { useState } from 'react';
import axios from 'axios';
import { isMobilePhone, isMobilePhoneLocales } from 'validator';
import jwt_axios from '../../services/JWTaxios';

import Spinner from '../LoaderSpinner/Spinner';

import ArrowDownIcon from '../../icons/arrow_down_icon.svg';
import ArrowUpIcon from '../../icons/arrow_up_icon.svg';
import WebsiteIcon from '../../icons/website_icon.svg';
import InstagramIcon from '../../icons/instagram_icon.svg';
import PhoneIcon from '../../icons/phone_icon.svg';

import dict from '../../dict.json';


export default function EditContacts({ 
    place,
    setPlace,
    places,
    setPlaces
}) {
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [newPhone, setNewPhone] = useState(place.phone);
    const [isPhoneValid, setPhoneValid] = useState(isMobilePhone(place.phone, isMobilePhoneLocales, {strictMode: true}));
    const [newWebsite, setNewWebsite] = useState(place.website ? place.website.split('www.')[1].replace('/','') : "");
    const [newInstagram, setNewInstagram] = useState(place.instagram ? place.instagram.split('instagram.com/')[1].replace('/','') : "");
    const [country, setCountry] = useState("");
    const [isCountryActive, setCountryActive] = useState(false);
    const [city, setCity] = useState("");
    const [isCityActive, setCityActive] = useState(false);
    const [street, setStreet] = useState("");
    const [isStreetValid, setStreetValid] = useState(false);
    const [popup, setPopup] = useState(false);

    const setContacts = async () => {
        setLoading(true);
        setMessages({});

        let locationInfo = await axios(
            "https://geocode-maps.yandex.ru/1.x/?apikey=d08fc50d-a7e6-4f37-bc51-1eb5df129e9d&format=json&geocode=" + country + "+" + city + "+" + street.split(/,|\.| /).join('+')
        );
        let coordinates = [...locationInfo.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(el => parseFloat(el)).reverse()];

        await jwt_axios.post("/core/place/update/" + place.id + "/", {
            "phone": newPhone,
            "instagram": "https://www.instagram.com/" + newInstagram,
            "website": newWebsite ? "http://www." + newWebsite : "http://www.none.com",
            "address": {
                "country": country,
                "city": city,
                "street": street,
                "coordinates": coordinates
            }
        }, {
            withCredentials: true 
        }).then((response) => {
            setPlace(response.data);
            let placeDataBefore = places.find(elem => elem.id === place.id);
            placeDataBefore.address = response.data.address;
            setPlaces([...places.filter(elem => elem.id !== place.id), placeDataBefore]);
            setPopup(true);
        }).catch((error) => {
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response ||
                error.toString()
            );
            setPopup(false);
        }).finally(() => {
            setLoading(false);
        });
    }

    const phoneValidator = (value) => {
        setNewPhone(value);
        setPhoneValid(isMobilePhone(value, isMobilePhoneLocales, {strictMode: true}) && value.length > 0);
    }

    const streetValidator = (value) => {
        setStreet(value);
        setStreetValid(value.length > 0 && value.length < 70);
    }

	return (
		<div>
            {isLoading ?
                <div className="margin-top">
                    <Spinner small={true} />
                </div>
            :   <div>
                    <div className="edit-scope">
                        <div className="edit-form-title">
                            Enter contacts
                        </div>
                        <div className="base-row">
                            <div className="icon-link">
                                <img className="phone-icon" src={PhoneIcon} alt="Phone icon" />
                            </div>
                            <div className="big-tip">
                                Phone:
                            </div>
                            <input
                                type="phone"
                                name="phone"
                                className={isPhoneValid || newPhone.length === 0 ? "input-text" : "input-text invalid"}
                                value={newPhone}
                                onChange={(e) => phoneValidator(e.target.value)}
                            />
                        </div>
                        <div className="base-row">
                            <div className="icon-link">
                                <img className="website-icon" src={WebsiteIcon} alt="Website icon" />
                            </div>
                            <div className="big-tip">
                                http://www.
                            </div>
                            <input
                                type="text"
                                name="website"
                                className="input-text"
                                placeholder="..."
                                value={newWebsite}
                                onChange={(e) => setNewWebsite(e.target.value)}
                            />
                        </div>
                        <div className="base-row">
                            <div className="icon-link">
                                <img className="instagram-icon" src={InstagramIcon} alt="Instagram icon" />
                            </div>
                            <div className="big-tip">
                                https://www.instagram.com/
                            </div>
                            <input
                                type="text"
                                name="instagram"
                                className="input-text"
                                placeholder="..."
                                value={newInstagram}
                                onChange={(e) => setNewInstagram(e.target.value)}
                            />
                        </div>
                        <div className="base-row top-stick">
                            <div className="filter-box half-width margin-right scrollable">
                                <div className="filter-header clickable" onClick={() => setCountryActive(!isCountryActive)}>
                                    Country
                                    <div className="invert arrow">
                                        {isCountryActive ?
                                        <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                                        : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                                        }
                                    </div>
                                </div>
                                <div className={isCountryActive ? "filter-location-expanded" : "filter-location-non-expanded"}>
                                    <div
                                        className="button filter-element active-button"
                                        onClick={() => {
                                            setCountryActive(!isCountryActive);
                                        }}
                                    >
                                        {country}
                                    </div>
                                </div>
                                {isCountryActive &&
                                    <div className="filter-body">
                                        {dict.countries_src && dict.countries_src.filter(element => element.country !== country).map((element, index) =>
                                            <div 
                                                key={index} 
                                                className="button filter-element"
                                                onClick={() => {
                                                    setCountry(element.country);
                                                    country!==element.country && setCity("");
                                                }}
                                            >
                                                {element.country}
                                            </div>
                                        )}
                                    </div>
                                }
                            </div>
                            { (country !== "") &&
                                <div className="filter-box half-width scrollable">
                                    <div className="filter-header clickable" onClick={() => setCityActive(!isCityActive)}>
                                        City
                                        <div className="invert arrow">
                                            {isCityActive ?
                                            <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                                            : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                                            }
                                        </div>
                                    </div>
                                    <div className={isCityActive ? "filter-location-expanded" : "filter-location-non-expanded"}>
                                        <div
                                            className="button filter-element active-button"
                                            onClick={() => {
                                                setCityActive(!isCityActive);
                                            }}
                                        >
                                            {city}
                                        </div>
                                    </div>
                                    {isCityActive &&
                                        <div className="filter-body">
                                            {dict.countries_src && dict.countries_src
                                                .find(element => element.country===country).cities
                                                .filter(element => element !== city)
                                                .map((element, index) => 
                                                    <div
                                                        key={index}
                                                        className="button filter-element"
                                                        onClick={() => {
                                                                setCity(element);
                                                            }}
                                                        >
                                                        {element}
                                                    </div>
                                            )}
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                        <div className="row">
                            <div className="big-tip">
                                Street:
                            </div>
                            <input
                                type="text"
                                name="street"
                                className={isStreetValid || street.length === 0 ? "input-text" : "input-text invalid"}
                                value={street}
                                onChange={(e) => streetValidator(e.target.value)}
                            />
                        </div>
                        <div className="row">
                            {isPhoneValid && isStreetValid && country && city ?
                                <div
                                    tabindex="0"
                                    className="save"
                                    onClick={() => setContacts()}
                                    onKeyDown={(e) => e.key === 'Enter' && setContacts()}
                                >
                                    Save
                                </div>
                            :   <div tabindex="0" className="button inactive">Save</div>
                            }
                        </div>
                    </div>
                    {popup &&
                        <div className="popup">
                            Contacts changed successfully
                        </div>
                    }
                    <div className="panel-error">
                        {messages.status &&
                            <div className="auth-error">
                                {messages.statusText}
                            </div>
                        }
                    </div>
                </div>
            }
		</div>
	);
}