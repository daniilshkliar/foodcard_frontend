import React, { useState } from 'react';
import axios from 'axios';

import './filter.css';

import DescendingIcon from '../../icons/descending_icon.svg';
import AscendingIcon from '../../icons/ascending_icon.svg';
import ArrowDownIcon from '../../icons/arrow_down_icon.svg';
import ArrowUpIcon from '../../icons/arrow_up_icon.svg';


export default function Filter({
    setSortMode,
    sortMode,
    setSortDirection,
    sortDirection,
    setOpen,
    open,
    setMinRating,
    minRating,
    setNextToMe,
    nextToMe,
    setOutdoors,
    outdoors,
    setVip,
    vip,
    setParking,
    parking,
    setSmoking,
    smoking,
    setCategories,
    categories,
    setCuisine,
    cuisine,
    setAdditionally,
    additionally,
    setInMenu,
    inMenu,
    setCountry,
    country,
    setCity,
    city,
    setCoordinates,
    sourceCoutries
    }) {


    const [isCategoryActive, setCategoryActive] = useState(false);
    const [isCuisineActive, setCuisineActive] = useState(false);
    const [isAdditionallyActive, setAdditionallyActive] = useState(false);
    const [isInMenuActive, setInMenuActive] = useState(false);
    const [isCountryActive, setCountryActive] = useState(false);
    const [isCityActive, setCityActive] = useState(false);

    const sourceCategories = [
        "Bar",
        "Restaurant",
        "Hookah",
        "Cafe",
        "Coffee shop",
        "Karaoke"
    ];

    const sourceCuisine = [
        "Fusion",
        "European",
        "Asian",
        "Italian",
        "Fusion",
        "European",
        "Asian",
        "Italian",
        "Fusion",
        "European",
        "Asian",
        "Italian",
        "Fusion",
        "European",
        "Asian",
        "Italian",
        "Fusion",
        "European",
        "Asian",
        "Italian"
    ];

    const sourceAdditionally = [
        "Wi-Fi",
        "Live music",
        "Dj-sets",
        "Playstation",
        "Dancefloor",
        "Karaoke"
    ];

    const sourceInMenu = [
        "Snacks",
        "Alcohol",
        "Burgers",
        "Pizza",
        "Pies"
    ];


    function handleCategoriesChange(element) {
        categories.includes(element) ?
            setCategories([...categories.filter(elem => elem !== element)])
        :   setCategories([...categories, element]);                       
    }

    function handleCuisineChange(element) {
        cuisine.includes(element) ?
            setCuisine([...cuisine.filter(elem => elem !== element)])
        :   setCuisine([...cuisine, element]);                       
    }

    function handleAdditionallyChange(element) {
        additionally.includes(element) ?
            setAdditionally([...additionally.filter(elem => elem !== element)])
        :   setAdditionally([...additionally, element]);                       
    }

    function handleInMenuChange(element) {
        inMenu.includes(element) ?
            setInMenu([...inMenu.filter(elem => elem !== element)])
        :   setInMenu([...inMenu, element]);                       
    }

    const fetchCountryCoordinates = async (country) => {

        const data = await axios(
            "https://geocode-maps.yandex.ru/1.x/?apikey=d08fc50d-a7e6-4f37-bc51-1eb5df129e9d&format=json&geocode=" + country
        );
        setCoordinates([...data.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(el => parseInt(el)).reverse()]);
    };

    const fetchCityCoordinates = async (country, city) => {
        
        const data = await axios(
            "https://geocode-maps.yandex.ru/1.x/?apikey=d08fc50d-a7e6-4f37-bc51-1eb5df129e9d&format=json&geocode=" + country + "+" + city
        );
        setCoordinates([...data.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(el => parseFloat(el)).reverse()]);
    };


    return (
        <div className="filter">
            <div className="main-filter-header">
                All filters
            </div>
            <div className="filter-box">
                <div className="filter-header">
                    Sort by
                </div>
                <div className="filter-body">   
                    <div className="sort-direction">
                        <div className={"button filter-element" + (sortDirection ? " active-button icon-selected" : "")}
                            onClick={() => setSortDirection(true)}>
                            <img src={DescendingIcon} alt={"Descending icon"} draggable="false" />
                        </div>
                        <div className={"button filter-element" + (!sortDirection ? " active-button icon-selected" : "")}
                            onClick={() => setSortDirection(false)}>
                            <img src={AscendingIcon} alt={"Ascending icon"} draggable="false" />
                        </div>
                    </div>
                    <div className={"button filter-element" + (sortMode===1 ? " active-button" : "")}
                        onClick={() => setSortMode(1)}>
                        Rating
                    </div>
                    <div className={"button filter-element" + (sortMode===2 ? " active-button" : "")}
                        onClick={() => setSortMode(2)}>
                        Popularity
                    </div>
                    <div className={"button filter-element" + (sortMode===3 ? " active-button" : "")}
                        onClick={() => setSortMode(3)}>
                        Distance
                    </div>
                </div>
            </div>
            <div className="filter-box">
                <div className="filter-header">
                    Open
                </div>
                <div className="filter-body">   
                    <div className={"button filter-element" + (open===1 ? " active-button" : "")}
                        onClick={() => setOpen(open===1 ? 0 : 1)}>
                        At least 3 more hours
                    </div>
                    <div className={"button filter-element" + (open===2 ? " active-button" : "")}
                        onClick={() => setOpen(open===2 ? 0 : 2)}>
                        Today
                    </div>
                    <div className={"button filter-element" + (open===3 ? " active-button" : "")}
                        onClick={() => setOpen(open===3 ? 0 : 3)}>
                        Tomorrow
                    </div>
                    <div className={"button filter-element" + (open===4 ? " active-button" : "")}
                        onClick={() => setOpen(open===4 ? 0 : 4)}>
                        Around the clock
                    </div>
                </div>
            </div>
            <div className="filter-box">
                <div className="filter-body margin-top">   
                    <div className={"button filter-element" + (nextToMe ? " active-button" : "")}
                        onClick={() => setNextToMe(!nextToMe)}>
                        Next to me
                    </div>
                    <div className={"button filter-element" + (outdoors ? " active-button" : "")}
                        onClick={() => setOutdoors(!outdoors)}>
                        Outdoors
                    </div>
                    <div className={"button filter-element" + (minRating ? " active-button" : "")}
                        onClick={() => setMinRating(!minRating)}>
                        4+ Stars
                    </div> 
                    <div className={"button filter-element" + (vip ? " active-button" : "")}
                        onClick={() => setVip(!vip)}>
                        VIP zone
                    </div>
                    <div className={"button filter-element" + (parking ? " active-button" : "")}
                        onClick={() => setParking(!parking)}>
                        Parking
                    </div>
                    <div className={"button filter-element" + (smoking ? " active-button" : "")}
                        onClick={() => setSmoking(!smoking)}>
                        Smoking
                    </div>
                </div>
            </div>
            <div className="filter-box half-width margin-right">
                <div className="filter-header clickable" onClick={() => setCountryActive(!isCountryActive)}>
                    Country
                    <div className="invert arrow">
                        {isCountryActive ?
                        <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                        : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                        }
                    </div>
                </div>
                {isCountryActive &&
                <div className="filter-body">
                    {sourceCoutries.map((element, index) => 
                        <div key={index} className={"button filter-element" + (country===element.country ? " active-button" : "")}
                            onClick={() => {
                                setCountry(element.country);
                                country!==element.country && setCity("");
                                fetchCountryCoordinates(element.country);
                            }}>
                            {element.country}
                        </div>
                    )}
                </div>}
            </div>
            { (country !== "") &&
            <div className="filter-box half-width">
                <div className="filter-header clickable" onClick={() => setCityActive(!isCityActive)}>
                    City
                    <div className="invert arrow">
                        {isCityActive ?
                        <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                        : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                        }
                    </div>
                </div>
                {isCityActive &&
                <div className="filter-body">
                    {sourceCoutries.find(element => element.country===country).city.map((element, index) => 
                        <div key={index} className={"button filter-element" + (city===element ? " active-button" : "")}
                            onClick={() => {
                                setCity(element);
                                fetchCityCoordinates(country, element);
                            }}>
                            {element}
                        </div>
                    )}
                </div>}
            </div>}
            <div className="filter-box">
                <div className="filter-header clickable" onClick={() => setCategoryActive(!isCategoryActive)}>
                    Category
                    <div className="invert arrow">
                        {isCategoryActive ?
                        <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                        : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                        }
                    </div>
                </div>
                {isCategoryActive &&
                <div className="filter-body">
                    {sourceCategories.map((element, index) => 
                        <div key={index} className={"button filter-element" + (categories.includes(element) ? " active-button" : "")}
                            onClick={() => handleCategoriesChange(element)}>
                            {element}
                        </div>
                    )}
                </div>}
            </div>
            <div className="filter-box">
                <div className="filter-header clickable" onClick={() => setCuisineActive(!isCuisineActive)}>
                    Cuisine
                    <div className="invert arrow">
                        {isCuisineActive ?
                        <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                        : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                        }
                    </div>
                </div>
                {isCuisineActive &&
                <div className="filter-body">
                    {sourceCuisine.map((element, index) => 
                        <div key={index} className={"button filter-element" + (cuisine.includes(element) ? " active-button" : "")}
                            onClick={() => handleCuisineChange(element)}>
                            {element}
                        </div>
                    )}
                </div>}
            </div>   
            <div className="filter-box">
                <div className="filter-header clickable" onClick={() => setInMenuActive(!isInMenuActive)}>
                    In menu
                    <div className="invert arrow">
                        {isInMenuActive ?
                        <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                        : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                        }
                    </div>
                </div>
                {isInMenuActive &&
                <div className="filter-body">
                    {sourceInMenu.map((element, index) => 
                        <div key={index} className={"button filter-element" + (inMenu.includes(element) ? " active-button" : "")}
                            onClick={() => handleInMenuChange(element)}>
                            {element}
                        </div>
                    )}
                </div>}
            </div>
            <div className="filter-box">
                <div className="filter-header clickable" onClick={() => setAdditionallyActive(!isAdditionallyActive)}>
                    Additionally
                    <div className="invert arrow">
                        {isAdditionallyActive ?
                        <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                        : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                        }
                    </div>
                </div>
                {isAdditionallyActive &&
                <div className="filter-body">
                    {sourceAdditionally.map((element, index) => 
                        <div key={index} className={"button filter-element" + (additionally.includes(element) ? " active-button" : "")}
                            onClick={() => handleAdditionallyChange(element)}>
                            {element}
                        </div>
                    )}
                </div>}
            </div>
        </div>
    );
}
