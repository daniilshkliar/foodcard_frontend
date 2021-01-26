import React, { useState, useEffect, useLayoutEffect, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { YMaps, Map, Placemark, ZoomControl } from 'react-yandex-maps';
import { motion, AnimatePresence } from 'framer-motion';
import BeautyStars from 'beauty-stars';

import Spinner from '../components/LoaderSpinner/Spinner';
import Header from '../components/Header/Header';
import Filter from '../components/Filter/Filter';

import SearchIcon from '../icons/search_icon.svg';
import CloseIcon from '../icons/close_icon.svg';
import ArrowUpIcon from '../icons/arrow_up_icon.svg';

import dict from '../dict.json';


function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }

        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    
    return size;
}

export default function Gallery() {
    const [width, height] = useWindowSize();
    const history = useHistory();
    const scrollRef = createRef();
    const minWidth = 730;

    const [coordinates, setCoordinates] = useState([53.907058, 27.557018]);
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredCard, setHoveredCard] = useState(-1);
    const [isFilterActive, setFilter] = useState(false);
    const [isMapOpen, setMapOpen] = useState(false);
    const [isElevatorActive, setElevator] = useState(false);
    
    const [places, setPlaces] = useState([]);
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [sortMode, setSortMode] = useState(2);
    const [open, setOpen] = useState(0);
    const [categories, setCategories] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [additionalServices, setAdditionalServices] = useState([]);
    const [inMenu, setInMenu] = useState([]);

    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCoordinates([position.coords.latitude, position.coords.longitude]);
            fetchLocation(position.coords.latitude, position.coords.longitude);
            return;
        });

        fetchLocation(53.907058, 27.557018);
        fetchPlaces();
    }, []);

    const fetchLocation = async (lat, long) => {
        const data = await axios("https://geocode-maps.yandex.ru/1.x/?apikey=d08fc50d-a7e6-4f37-bc51-1eb5df129e9d&format=json&geocode=" + long + "," + lat + "&lang=en-US");
        let country = data.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.CountryName;
        let city = data.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.AdministrativeAreaName;
        
        if (dict.countries_src.find(element => element.country===country && element.cities.find(el => el===city))) {
            setCountry(country);
            setCity(city);
        }
    }

    const fetchPlaces = async () => {
        setLoading(true);
        setMessages({});

        await axios.get("/core/place/get/all/"
        ).then((response) => {
            setPlaces(response.data);
        }).catch((error) => {
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

    return (
        <div className="app">
            <Header isClickable={true} />
            <AnimatePresence>
                {isFilterActive &&
                    <div>
                        <motion.div
                            className="filter-background"
                            onClick={() => setFilter(!isFilterActive)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div
                            className="filter-window"
                            transition={{ duration: 0.4 }}
                            initial={{ left: "-500px" }}
                            animate={{ left: "0px" }}
                            exit={{ left: "-500px" }}
                        >
                            <Filter
                                country={country}
                                setCountry={setCountry}
                                city={city}
                                setCity={setCity}
                                setCoordinates={setCoordinates}
                                sortMode={sortMode}
                                setSortMode={setSortMode}
                                open={open}
                                setOpen={setOpen}
                                categories={categories}
                                setCategories={setCategories}
                                cuisines={cuisines}
                                setCuisines={setCuisines}
                                additionalServices={additionalServices}
                                setAdditionalServices={setAdditionalServices}
                                inMenu={inMenu}
                                setInMenu={setInMenu}
                            />
                            <div
                                className="filter-close"
                                onClick={() => setFilter(!isFilterActive)}
                            >
                                <img src={CloseIcon} alt="Close icon" draggable="false" />
                            </div>
                        </motion.div>
                    </div>
                }
            </AnimatePresence>
            <div className="wrapper">
                {((width >= minWidth) || (width < minWidth && isMapOpen)) &&
                    <div className="left-scope">
                        <YMaps>
                            <Map className="main-map" state={{ center: coordinates, zoom: 13 }}>
                                <ZoomControl options={{ size: 'small', position: { bottom: 50, right: 15 }}} />
                                {places && places.map((place, index) =>
                                    <Placemark 
                                        key={index}
                                        geometry={[place.address.coordinates[0], place.address.coordinates[1]]}
                                        options={{ 
                                            iconColor: (hoveredCard === place.id ? 'red' : 'black')
                                        }}
                                        modules={['geoObject.addon.balloon']}
                                        properties={{
                                            balloonContentHeader:
                                                '<div class="balloon-header"><a href="/place/' + place.address.city + '/'+ place.title + '/">' + place.title + '</a></div>'
                                            ,
                                            balloonContentBody:
                                                '<div class="balloon">' +
                                                    '<a href="/place/' + place.address.city + '/'+ place.title + '/">' +
                                                    '<div class="balloon-box"><div class="balloon-row">' + place.main_category + '</div></div>' +
                                                    (place.main_photo && place.main_photo.thumbnail_uri?
                                                        '<img class="balloon-photo" src="' + place.main_photo.thumbnail_uri + '" alt="Photo of ' + place.main_category + ' ' + place.title + '" draggable="false" />'
                                                    :   '')
                                                    + '</a>' +
                                                '</div>'
                                        }}
                                    />
                                )}
                            </Map>
                        </YMaps>
                        {isMapOpen &&
                            <div
                                className="map-close"
                                onClick={() => setMapOpen(!isMapOpen)}
                            >
                                <img src={CloseIcon} alt="Close icon" draggable="false" />
                            </div>
                        }
                    </div>
                }
                {!isMapOpen &&
                    <div
                        className="right-scope" 
                        ref={scrollRef}
                        onScroll={() => setElevator(scrollRef.current.scrollTop >= 800)}
                    >
                        {isLoading ?
                            <Spinner />
                        :   <div>
                                {isElevatorActive && 
                                    <div className="elevator" onClick={() => scrollRef.current.scrollTo(0, 0)}>
                                        <img src={ArrowUpIcon} alt="Arrow up icon" draggable="false" />
                                    </div>
                                }
                                <div className="options-panel">
                                    {width < minWidth && 
                                        <div className="show-map">
                                            <div className="button active-button" onClick={() => setMapOpen(!isMapOpen)}>
                                                Map
                                            </div>
                                        </div>
                                    }
                                    <div className="searchbar">
                                        <input 
                                            type="text" 
                                            id="query"
                                            name="query" 
                                            value={searchQuery}
                                            placeholder="Search"
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />        
                                        <div className="searchbutton active-button" onClick={() => {console.log(searchQuery)}}>
                                            <img src={SearchIcon} alt="Search icon" draggable="false" />
                                        </div>
                                    </div>
                                    <div className="filterbutton">
                                        <div className="button active-button" onClick={() => setFilter(!isFilterActive)}>
                                            Filter
                                        </div>
                                    </div>
                                </div>
                                <div className="gallery">
                                    {places && places.map((place, index) => (
                                        <div 
                                            key={index}
                                            className="gallery-card"
                                            onMouseEnter={() => setHoveredCard(place.id)}
                                            onMouseLeave={() => setHoveredCard(-1)}
                                            onClick={() => history.push("/place/" + place.address.city + "/" + place.title + "/")}
                                        >
                                            <div className="gallery-card-photo">
                                                {place.main_photo && place.main_photo.thumbnail_uri ?
                                                    <img src={place.main_photo.thumbnail_uri} alt={"A photo of " + place.title} draggable="false" />
                                                :   <div className={"thumbnail-photo color" + Math.floor(Math.random() * Math.floor(7))}></div>
                                                }
                                            </div>
                                            <div className="gallery-card-title">
                                                {place.title}
                                            </div>
                                            <div className="gallery-card-category">
                                                <div>{place.main_category}</div>
                                                <div class="dot"></div>
                                                {place.operation_hours[0] &&
                                                    <div>
                                                        Until {new Date(place.operation_hours[new Date().getDay() - 1][1]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hour12: false })}
                                                    </div>
                                                }
                                            </div>
                                            <div className="gallery-card-cuisine">
                                                {place.main_cuisine} cuisine
                                            </div>
                                            {place.general_review &&
                                                <div>
                                                    <div className="gallery-card-rating">
                                                        {place.general_review.rounded_rating===null ?
                                                            <div className="text-color-main">
                                                                No rating
                                                            </div>
                                                        :   <BeautyStars
                                                                value={place.general_review.rounded_rating}
                                                                size="18px"
                                                                gap="4px"
                                                                inactiveColor="#DADADA"
                                                                activeColor="#ED6E2D"
                                                            />
                                                        }
                                                    </div>
                                                    <div className="gallery-card-reviews">
                                                        {place.general_review.amount} reviews
                                                    </div>
                                                </div>
                                            }
                                            <div className="gallery-card-address">
                                                {place.address.city + ", " + place.address.street}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    );
}
