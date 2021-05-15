import React, { useState, useEffect, useLayoutEffect, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { YMaps, Map, Placemark, ZoomControl } from 'react-yandex-maps';
import { motion, AnimatePresence } from 'framer-motion';
import BeautyStars from 'beauty-stars';
import moment from 'moment-timezone';

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
    const [scrolValue, setScrolValue] = useState(0);
    
    const [places, setPlaces] = useState([]);
    const [country, setCountry] = useState("Belarus");
    const [city, setCity] = useState("Minsk");
    const [sortMode, setSortMode] = useState(2);
    const [open, setOpen] = useState(0);
    const [categories, setCategories] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [additionalServices, setAdditionalServices] = useState([]);
    const [inMenu, setInMenu] = useState([]);

    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState(1);

    let day = new Date().getDay() - 1;
    if (day === -1) day = 6;

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCoordinates([position.coords.latitude, position.coords.longitude]);
            fetchLocation(position.coords.latitude, position.coords.longitude);
            return;
        });

        fetchLocation(53.907058, 27.557018);
        fetchPlaces(1, categories, cuisines, additionalServices, country, city);
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

    const fetchPlaces = async (page, cat, cui, ser, ctr, cty, search, mode) => {
        setLoading(true);
        setMessages({});

        let queries = ""
        if (!search) {
            queries += "cat="
            if (cat.length > 0) queries += cat.join('&cat=')
            else queries += dict.categories_src.map((elem, index) => index + 1).join('&cat=')
            queries += "&cui="
            if (cui.length > 0) queries += cui.join('&cui=')
            else queries += dict.cuisines_src.map((elem, index) => index + 1).join('&cui=')
            queries += "&ser="
            if (ser.length > 0) queries += ser.join('&ser=')
            else queries += dict.additional_src.map((elem, index) => index + 1).join('&ser=')
            queries += "&ctr=" + ctr
            queries += "&cty=" + cty
        } else {
            queries += "search=" + search
        }

        page && await axios.get("/core/places/?" + queries + "&page=" + page
        ).then((response) => {
            let result = []
            page === 1 ? 
                result = response.data.results
            :   result = [...places, ...response.data.results];

            if (mode === 1) result.sort((a, b) => b.amount - a.amount)
            else if (mode === 2) result.sort((a, b) => b.rounded_rating - a.rounded_rating)
            else if (mode === 3) result.sort()

            setPlaces(result);
            setNextPage(response.data.next ? nextPage + 1 : null);
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
                                fetchPlaces={fetchPlaces}
                                setSearchQuery={setSearchQuery}
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
                                        geometry={[place.coordinates[0], place.coordinates[1]]}
                                        options={{ 
                                            iconColor: (hoveredCard === place.id ? 'red' : 'black')
                                        }}
                                        modules={['geoObject.addon.balloon']}
                                        properties={{
                                            balloonContentHeader:
                                                '<div class="balloon-header"><a href="/place/' + place.city + '/'+ place.title + '/">' + place.title + '</a></div>'
                                            ,
                                            balloonContentBody:
                                                '<div class="balloon">' +
                                                    '<a href="/place/' + place.city + '/'+ place.title + '/">' +
                                                    '<div class="balloon-box"><div class="balloon-row">' + dict.categories_src_dict[place.main_category.name] + '</div></div>' +
                                                    (place.main_photo?
                                                        '<img class="balloon-photo" src="' + place.main_photo + '" alt="Photo of ' + place.main_category.name + ' ' + place.title + '" draggable="false" />'
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
                        onScroll={() => {
                            setElevator(scrollRef.current.scrollTop >= 800);
                            if (nextPage && scrollRef.current.scrollHeight - scrollRef.current.scrollTop === scrollRef.current.clientHeight) {
                                fetchPlaces(nextPage, categories, cuisines, additionalServices, country, city);
                            }
                        }}
                    >
                        <div className="gallery-padding">
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
                                        placeholder="Поиск"
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            e.key === 'Enter' && fetchPlaces(1, categories, cuisines, additionalServices, country, city, searchQuery);
                                            setCategories([]);
                                            setCuisines([]);
                                            setAdditionalServices([]);
                                        }
                                    }
                                    />        
                                    <div className="searchbutton active-button" onClick={() => {
                                        fetchPlaces(1, categories, cuisines, additionalServices, country, city, searchQuery)
                                        setCategories([]);
                                        setCuisines([]);
                                        setAdditionalServices([]);
                                    }}>
                                        <img src={SearchIcon} alt="Search icon" draggable="false" />
                                    </div>
                                </div>
                                <div className="filterbutton">
                                    <div className="button active-button" onClick={() => setFilter(!isFilterActive)}>
                                        Фильтры
                                    </div>
                                </div>
                            </div>
                            <div className="gallery">
                                {messages.status &&
                                    <div className="auth-error">
                                        {messages.statusText}
                                    </div>
                                }
                                {places && places.map((place, index) => (
                                    <div 
                                        key={index}
                                        className="gallery-card"
                                        onMouseEnter={() => setHoveredCard(place.id)}
                                        onMouseLeave={() => setHoveredCard(-1)}
                                        onClick={() => history.push("/place/" + place.city + "/" + place.title + "/")}
                                    >
                                        <div className="gallery-card-photo">
                                            {place.main_photo ?
                                                <img src={place.main_photo} alt={"A photo of " + place.title} draggable="false" />
                                            :   <div className={"thumbnail-photo color" + place.id%10}></div>
                                            }
                                        </div>
                                        <div className="gallery-card-title">
                                            {place.title}
                                        </div>
                                        <div className="gallery-card-category">
                                            <div>{dict.categories_src_dict[place.main_category.name]}</div>
                                            <div class="dot"></div>
                                            {place.opening_hours && place.opening_hours[day][1] &&
                                                <div>
                                                    До {moment.utc(place.opening_hours[day][1]).tz(place.timezone).format("HH:mm")}
                                                </div>
                                            }
                                        </div>
                                        <div className="gallery-card-cuisine">
                                            {dict.cuisines_src_dict[place.main_cuisine.name]} кухня
                                        </div>
                                        <div>
                                            <div className="gallery-card-rating">
                                                {place.rounded_rating === null ?
                                                    <div className="text-color-main tip">
                                                        Нет рейтинга
                                                    </div>
                                                :   <BeautyStars
                                                        value={place.rounded_rating}
                                                        size="18px"
                                                        gap="4px"
                                                        editable="false"
                                                        inactiveColor="#DADADA"
                                                        activeColor="#ED6E2D"
                                                    />
                                                }
                                            </div>
                                            <div className="gallery-card-reviews">
                                                {place.amount} отзывов
                                            </div>
                                        </div>
                                        <div className="gallery-card-address">
                                            {dict.cities_src_dict[place.city] + ", " + place.street}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {isLoading && <Spinner small={true}/>}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
