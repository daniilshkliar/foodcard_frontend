import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { isMobilePhone, isMobilePhoneLocales, isEmail, isAlpha } from 'validator';
import axios from 'axios';
import moment from 'moment-timezone';
import jwt_axios from '../../services/JWTaxios';
import Timer from 'react-compound-timer';
import { YMaps, Map, Placemark, ZoomControl } from 'react-yandex-maps';

import Spinner from '../LoaderSpinner/Spinner';
import NotFound from '../../screens/NotFound';


import ArrowDownIcon from '../../icons/arrow_down_icon.svg';
import ArrowUpIcon from '../../icons/arrow_up_icon.svg';
import AccountIcon from '../../icons/account_icon.svg';
import StairsIcon from '../../icons/stairs_icon.png';
import VipIcon from '../../icons/vip_icon.png';
import PhoneIcon from '../../icons/phone_icon.svg';
import CloseIcon from '../../icons/close_icon.svg';
import DepositIcon from '../../icons/deposit_icon.png';

import dict from '../../dict.json';


export default function PlaceCreation({
    places,
    setPlaces,
    setCreateOption
}) {
    const history = useHistory();
    const [isCreating, setCreating] = useState(false);
    const [messages, setMessages] = useState({});

    const [newTitle, setTitle] = useState("");
    const [isTitleValid, setTitleValid] = useState(false);
    const [newPhone, setNewPhone] = useState("");
    const [isPhoneValid, setPhoneValid] = useState(false);
    const [country, setCountry] = useState(null);
    const [isCountryActive, setCountryActive] = useState(false);
    const [city, setCity] = useState(null);
    const [coordinates, setCoordinates] = useState([53.907058, 27.557018]);
    const [isCityActive, setCityActive] = useState(false);
    const [street, setStreet] = useState("");
    const [isStreetValid, setStreetValid] = useState(false);
    const [floor, setFloor] = useState(1);
    const [newMainCategory, setNewMainCategory] = useState(null);
    const [isMainCategoryActive, setMainCategoryActive] = useState(false);
    const [newMainCuisine, setNewMainCuisine] = useState(null);
    const [isMainCuisineActive, setMainCuisineActive] = useState(false);


    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCoordinates([position.coords.latitude, position.coords.longitude]);
            fetchLocation(position.coords.latitude, position.coords.longitude);
            return;
        });

        fetchLocation(53.907058, 27.557018);
	}, []);

    
    const fetchLocation = async (lat, long) => {
        const data = await axios("https://geocode-maps.yandex.ru/1.x/?apikey=d08fc50d-a7e6-4f37-bc51-1eb5df129e9d&format=json&geocode=" + long + "," + lat + "&lang=en-US");
        let country = data.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.CountryName;
        let city = data.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.AdministrativeAreaName;
        
        if (dict.countries_src.find(element => element.country[0]===country && element.cities.find(el => el[0]===city))) {
            setCountry(country);
            setCity(city);
        }
    }

    const createPlace = async () => {
        setCreating(true);
        setMessages({});

        await jwt_axios.post("/core/places/create/", {
            country: country,
            title: newTitle,
            phone: newPhone,
            city: city,
            street: street,
            coordinates: [parseFloat(coordinates[0]).toFixed(6), parseFloat(coordinates[0]).toFixed(6)],
            main_category: newMainCategory,
            main_cuisine: newMainCuisine,
            additional_categories: [],
            additional_cuisines: []
        }).then((response) => {
            setPlaces([response.data, ...places]);
        }).catch((error) => {
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response ||
                error.toString()
            );
        }).finally(() => {
            setCreating(false);
        });
    }

    const titleValidator = (value) => {
        setTitle(value);
        setTitleValid(value.length > 0 && value.length <= 70);
    }

    const change_location = async (ctry, cty, str) => {
        let locationInfo = await axios(
            "https://geocode-maps.yandex.ru/1.x/?apikey=d08fc50d-a7e6-4f37-bc51-1eb5df129e9d&format=json&geocode=" + ctry + "+" + cty + "+" + str.split(/,|\.| /).join('+')
        );
        setCoordinates([...locationInfo.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(el => parseFloat(el)).reverse()]);
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
            <div className="reservation-delete-background">
                <div className="place-creation-window">
                    <div
                        className="filter-close"
                        onClick={() => setCreateOption(false)}
                    >
                        <img src={CloseIcon} alt="Close icon" draggable="false" />
                    </div>
                    {messages.status &&
                        <div className="auth-error">
                            {messages.statusText}
                        </div>
                    }
                    <div className="auth-title">
                        Форма создания заведения
                    </div>
                    {isCreating ?
                        <Spinner small={true} />
                    :   <div className="">
                            <div className="label">
                                Введите название
                            </div>
                            <div className="base-row">
                                <input
                                    type="title"
                                    name="title"
                                    className={isTitleValid ? "input-text" : "input-text invalid"}
                                    value={newTitle}
                                    onChange={(e) => titleValidator(e.target.value)}
                                />
                            </div>
                            <div className="base-row">
                                <div className="icon-link">
                                    <img className="phone-icon" src={PhoneIcon} alt="Phone icon" />
                                </div>
                                <div className="label">
                                    Телефон:
                                </div>
                                <input
                                    type="phone"
                                    name="phone"
                                    className={isPhoneValid ? "input-text" : "input-text invalid"}
                                    value={newPhone}
                                    onChange={(e) => phoneValidator(e.target.value)}
                                />
                            </div>
                            <div className="base-row top-stick">
                                <div className="filter-box half-width margin-right scrollable">
                                    <div className="filter-header clickable" onClick={() => setCountryActive(!isCountryActive)}>
                                        Страна
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
                                            {dict.countries_src_dict[country]}
                                        </div>
                                    </div>
                                    {isCountryActive &&
                                        <div className="filter-body">
                                            {dict.countries_src && dict.countries_src.filter(element => element.country[0] !== country).map((element, index) =>
                                                <div 
                                                    key={index} 
                                                    className="button filter-element"
                                                    onClick={() => {
                                                        change_location(element.country[0], "", "");
                                                        setCountry(element.country[0]);
                                                        setCity("");
                                                        setStreet("");
                                                    }}
                                                >
                                                    {element.country[1]}
                                                </div>
                                            )}
                                        </div>
                                    }
                                </div>
                                { (country !== "") &&
                                    <div className="filter-box half-width scrollable">
                                        <div className="filter-header clickable" onClick={() => setCityActive(!isCityActive)}>
                                            Город
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
                                                {dict.cities_src_dict[city]}
                                            </div>
                                        </div>
                                        {isCityActive &&
                                            <div className="filter-body">
                                                {dict.countries_src && dict.countries_src
                                                    .find(element => element.country[0]===country).cities
                                                    .filter(element => element[0] !== city)
                                                    .map((element, index) => 
                                                        <div
                                                            key={index}
                                                            className="button filter-element"
                                                            onClick={() => {
                                                                change_location(country, element[0], "");
                                                                setCity(element[0]);
                                                                setStreet("");
                                                            }}
                                                        >
                                                            {element[1]}
                                                        </div>
                                                )}
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                            <div className="row">
                                <div className="label">
                                    Улица:
                                </div>
                                <input
                                    type="text"
                                    name="street"
                                    className={isStreetValid ? "input-text" : "input-text invalid"}
                                    value={street}
                                    onChange={(e) => {
                                        streetValidator(e.target.value);
                                        change_location(country, city, e.target.value);
                                    }}
                                />
                            </div>
                            <div className="row flex-start">
                                <div className="label">
                                    Этаж:
                                </div>
                                <input
                                    type="number"
                                    name="floor"
                                    className={floor || floor === 0 ? "input-text" : "input-text invalid"}
                                    value={floor}
                                    onChange={(e) => setFloor(parseInt(e.target.value))}
                                />
                            </div>
                            <div className="place-map">
                                <YMaps>
                                    <Map className="main-map" state={{ center: coordinates, zoom: 16 }}>
                                        <ZoomControl options={{ size: 'small', position: { bottom: 30, right: 10 }}} />
                                        <Placemark
                                            geometry={coordinates}
                                            options={{ iconColor: 'red' }}
                                        />
                                    </Map>
                                </YMaps>
                            </div>
                            <div className="filter-box half-width margin-right scrollable margin-top">
                                <div className="filter-header clickable" onClick={() => setMainCategoryActive(!isMainCategoryActive)}>
                                    Основная категория
                                    <div className="invert arrow">
                                        {isMainCategoryActive ?
                                        <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                                        : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                                        }
                                    </div>
                                </div>
                                <div className={isMainCategoryActive ? "filter-location-expanded" : "filter-location-non-expanded"}>
                                    <div
                                        className="button filter-element active-button"
                                        onClick={() => {
                                            setMainCategoryActive(!isMainCategoryActive);
                                        }}
                                    >
                                        {dict.categories_src_dict[newMainCategory]}
                                    </div>
                                </div>
                                {isMainCategoryActive &&
                                    <div className="filter-body">
                                        {dict.categories_src ?
                                            dict.categories_src.filter(element => element[0] !== newMainCategory).map((element, index) =>
                                                <div 
                                                    key={index} 
                                                    className="button filter-element"
                                                    onClick={() => setNewMainCategory(element[0])}
                                                >
                                                    {element[1]}
                                                </div>
                                            )
                                        :   <div className="tip small-margin-top">
                                                Пусто
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                            <div className="filter-box half-width margin-right scrollable margin-top">
                                <div className="filter-header clickable" onClick={() => setMainCuisineActive(!isMainCuisineActive)}>
                                    Основная кухня
                                    <div className="invert arrow">
                                        {isMainCuisineActive ?
                                        <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                                        : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                                        }
                                    </div>
                                </div>
                                <div className={isMainCuisineActive ? "filter-location-expanded" : "filter-location-non-expanded"}>
                                    <div
                                        className="button filter-element active-button"
                                        onClick={() => {
                                            setMainCuisineActive(!isMainCuisineActive);
                                        }}
                                    >
                                        {dict.cuisines_src_dict[newMainCuisine]}
                                    </div>
                                </div>
                                {isMainCuisineActive &&
                                    <div className="filter-body">
                                        {dict.cuisines_src ?
                                            dict.cuisines_src.filter(element => element[0] !== newMainCuisine).map((element, index) =>
                                                <div 
                                                    key={index} 
                                                    className="button filter-element"
                                                    onClick={() => setNewMainCuisine(element[0])}
                                                >
                                                    {element[1]}
                                                </div>
                                            )
                                        :   <div className="tip small-margin-top">
                                                Пусто
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                            <div className="row">
                                {isTitleValid & floor && isPhoneValid && isStreetValid && country && city && newMainCategory && newMainCuisine ?
                                    <div
                                        tabindex="0"
                                        className="save"
                                        onClick={() => createPlace()}
                                        onKeyDown={(e) => e.key === 'Enter' && createPlace()}
                                    >
                                        Сохранить
                                    </div>
                                :   <div tabindex="0" className="button inactive">Сохранить</div>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}