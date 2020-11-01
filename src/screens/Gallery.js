import React, { useState, useEffect, useLayoutEffect, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import { YMaps, Map, Placemark, ZoomControl } from 'react-yandex-maps';
import BeautyStars from 'beauty-stars';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import Header from '../components/Header/Header';
import Filter from '../components/Filter/Filter';

import SearchIcon from '../icons/search_icon.svg';
import CloseIcon from '../icons/close_icon.svg';
import ArrowUpIcon from '../icons/arrow_up_icon.svg';

import places from '../places.json';

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
    const [coordinates, setCoordinates] = useState([53.907058, 27.557018]);
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredCard, setHoveredCard] = useState(-1);
    const [isFilterActive, setFilter] = useState(false);
    const [sortDirection, setSortDirection] = useState(true);
    const [sortMode, setSortMode] = useState(2);
    const [open, setOpen] = useState(0);
    const [minRating, setMinRating] = useState(false);
    const [nextToMe, setNextToMe] = useState(false);
    const [outdoors, setOutdoors] = useState(false);
    const [vip, setVip] = useState(false);
    const [parking, setParking] = useState(false);
    const [smoking, setSmoking] = useState(false);
    const [categories, setCategories] = useState([]);
    const [cuisine, setCuisine] = useState([]);
    const [additionally, setAdditionally] = useState([]);
    const [inMenu, setInMenu] = useState([]);
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [isElevatorActive, setElevator] = useState(false);
    const scrollRef = createRef();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMapOpen, setMapOpen] = useState(false);
    const minWidth = 730;

    const sourceCoutries = [
        {
            country: "Belarus",
            city: [
                "Grodno",
                "Minsk",
                "Gomel"
            ]
        },
        {
            country: "Germany",
            city: [
                "Berlin",
                "Bremen"
            ]
        }
    ];


    useEffect(() => {

        const fetchData = async (lat, long) => {

            const data = await axios(
                "https://geocode-maps.yandex.ru/1.x/?apikey=d08fc50d-a7e6-4f37-bc51-1eb5df129e9d&format=json&geocode=" + long + "," + lat + "&lang=en-US"
            );
            let country = data.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.CountryName;
            let city = data.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.AdministrativeAreaName;
            
            if (sourceCoutries.find(element => element.country===country && element.city.includes(city))) {
                setCountry(country);
                setCity(city);
            }
        };

        (() => {
            navigator.geolocation.getCurrentPosition((position) => {
                setCoordinates([position.coords.latitude, position.coords.longitude]);
                fetchData(position.coords.latitude, position.coords.longitude);
                return;
            });
            fetchData(53.907058, 27.557018);
        })();
    }, []);


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
                            animate={{ left: "0" }}
                            exit={{ left: "-500px" }}
                        >
                            <Filter
                                setFilter={setFilter}
                                isFilterActive={isFilterActive}
                                setSortDirection={setSortDirection}
                                sortDirection={sortDirection}
                                setSortMode={setSortMode}
                                sortMode={sortMode}
                                setOpen={setOpen}
                                open={open}
                                setMinRating={setMinRating}
                                minRating={minRating}
                                setNextToMe={setNextToMe}
                                nextToMe={nextToMe}
                                setOutdoors={setOutdoors}
                                outdoors={outdoors}
                                setVip={setVip}
                                vip={vip}
                                setParking={setParking}
                                parking={parking}
                                setSmoking={setSmoking}
                                smoking={smoking}
                                setCategories={setCategories}
                                categories={categories}
                                setCuisine={setCuisine}
                                cuisine={cuisine}
                                setAdditionally={setAdditionally}
                                additionally={additionally}
                                setInMenu={setInMenu}
                                inMenu={inMenu}
                                setCountry={setCountry}
                                country={country}
                                setCity={setCity}
                                city={city}
                                setCoordinates={setCoordinates}
                                sourceCoutries={sourceCoutries}
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
                                {places.places.map((place, index) =>
                                    <Placemark 
                                        key={index}
                                        geometry={place.coordinates}
                                        options={{ 
                                            iconColor: (hoveredCard === place.id ? 'red' : 'black')
                                        }}
                                        modules={['geoObject.addon.balloon']}
                                        properties={{
                                            balloonContentHeader:
                                                '<div class="balloon-header"><a href="/place/' + place.id + '/">' + place.title + '</a></div>'
                                            ,
                                            balloonContentBody:
                                                '<div class="balloon">' +
                                                    '<a href="/place/' + place.id + '/">' +
                                                    '<div class="balloon-box"><div class="balloon-row">' + place.category + '</div></div>' +
                                                    '<img class="balloon-photo" src="' + place.photo + '" alt="Photo of ' + place.category + ' ' + place.title + '" draggable="false" /></a>' +
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
                                    onChange={(e) => setSearchQuery(e.target.value)} />        
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
                            {places.places.map((place, index) => (
                                <div 
                                    key={index}
                                    className="gallery-card"
                                    onMouseEnter={() => setHoveredCard(place.id)}
                                    onMouseLeave={() => setHoveredCard(-1)}
                                    onClick={() => history.push("/place/" + place.id + "/")}
                                >
                                    <div className="gallery-card-photo">
                                        <img src={place.photo} alt={"A photo of " + place.title} draggable="false" />
                                    </div>
                                    <div className="gallery-card-title">
                                        {place.title}
                                    </div>
                                    <div className="gallery-card-category">
                                        <div>{place.category}</div>
                                        <div class="dot"></div>
                                        <div>Until {place.schedule[1]}</div>
                                    </div>
                                    <div className="gallery-card-rating">
                                        {place.rating===null ?
                                            "No rating"
                                            :
                                            <BeautyStars
                                                value={place.rating}
                                                size="20px"
                                                gap="4px"
                                                inactiveColor="#DADADA"
                                                activeColor="#ED6E2D"
                                            />
                                        }
                                    </div>
                                    <div className="gallery-card-reviews">
                                        {place.reviews} reviews
                                    </div>
                                    <div className="gallery-card-cuisine">
                                        {place.cuisine}
                                    </div>
                                    <div className="gallery-card-address">
                                        {place.address.city + ", " + place.address.street}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }  
            </div>
        </div>
    );
}
