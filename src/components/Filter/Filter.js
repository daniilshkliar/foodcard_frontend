import React, { useState } from 'react';
import axios from 'axios';

import './filter.css';

import ArrowDownIcon from '../../icons/arrow_down_icon.svg';
import ArrowUpIcon from '../../icons/arrow_up_icon.svg';

import dict from '../../dict.json';


export default function Filter({
    country,
    setCountry,
    city,
    setCity,
    setCoordinates,
    sortMode,
    setSortMode,
    open,
    setOpen,
    categories,
    setCategories,
    cuisines,
    setCuisines,
    additionalServices,
    setAdditionalServices,
    inMenu,
    setInMenu,
    }) {

    const [isCountryActive, setCountryActive] = useState(false);
    const [isCityActive, setCityActive] = useState(false);
    const [isCategoryActive, setCategoryActive] = useState(false);
    const [isCuisineActive, setCuisineActive] = useState(false);
    const [isAdditionalServicesActive, setAdditionalServicesActive] = useState(false);
    const [isInMenuActive, setInMenuActive] = useState(false);

    const handleCategoriesChange = (element) => {
        categories.includes(element) ?
            setCategories([...categories.filter(elem => elem !== element)])
        :   setCategories([...categories, element]);                       
    }

    const handleCuisinesChange = (element) => {
        cuisines.includes(element) ?
            setCuisines([...cuisines.filter(elem => elem !== element)])
        :   setCuisines([...cuisines, element]);                       
    }

    const handleAdditionalServicesChange = (element) => {
        additionalServices.includes(element) ?
            setAdditionalServices([...additionalServices.filter(elem => elem !== element)])
        :   setAdditionalServices([...additionalServices, element]);                       
    }

    const handleInMenuChange = (element) => {
        inMenu.includes(element) ?
            setInMenu([...inMenu.filter(elem => elem !== element)])
        :   setInMenu([...inMenu, element]);                       
    }

    const fetchCountryCoordinates = async (country) => {
        const data = await axios(
            "https://geocode-maps.yandex.ru/1.x/?apikey=d08fc50d-a7e6-4f37-bc51-1eb5df129e9d&format=json&geocode=" + country
        );
        setCoordinates([...data.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(el => parseInt(el)).reverse()]);
    }

    const fetchCityCoordinates = async (country, city) => {
        const data = await axios(
            "https://geocode-maps.yandex.ru/1.x/?apikey=d08fc50d-a7e6-4f37-bc51-1eb5df129e9d&format=json&geocode=" + country + "+" + city
        );
        setCoordinates([...data.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(el => parseFloat(el)).reverse()]);
    }

    return (
        <div className="filter">
            <div className="main-filter-header">
                All filters
            </div>
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
                                    fetchCountryCoordinates(element.country);
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
                                                fetchCityCoordinates(country, element);
                                            }}
                                        >
                                        {element}
                                    </div>
                            )}
                        </div>
                    }
                </div>
            }
            <div className="filter-box">
                <div className="filter-header">
                    Sort by
                </div>
                <div className="filter-body">
                    <div className={"button filter-element" + (sortMode===1 ? " active-button" : "")}
                        onClick={() => setSortMode(1)}>
                        Most rated
                    </div>
                    <div className={"button filter-element" + (sortMode===2 ? " active-button" : "")}
                        onClick={() => setSortMode(2)}>
                        Most popular
                    </div>
                    <div className={"button filter-element" + (sortMode===3 ? " active-button" : "")}
                        onClick={() => setSortMode(3)}>
                        Distance from me
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
            {dict.categories_src &&
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
                        {dict.categories_src.map((element, index) => 
                            <div key={index} className={"button filter-element" + (categories.includes(element) ? " active-button" : "")}
                                onClick={() => handleCategoriesChange(element)}>
                                {element}
                            </div>
                        )}
                    </div>}
                </div>
            }
            {dict.additional_src &&
                <div className="filter-box">
                    <div className="filter-header clickable" onClick={() => setAdditionalServicesActive(!isAdditionalServicesActive)}>
                        Additional
                        <div className="invert arrow">
                            {isAdditionalServicesActive ?
                            <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                            : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                            }
                        </div>
                    </div>
                    {isAdditionalServicesActive &&
                    <div className="filter-body">
                        {dict.additional_src.map((element, index) => 
                            <div key={index} className={"button filter-element" + (additionalServices.includes(element) ? " active-button" : "")}
                                onClick={() => handleAdditionalServicesChange(element)}>
                                {element}
                            </div>
                        )}
                    </div>}
                </div>
            }
            {dict.inmenu_src &&
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
                        {dict.inmenu_src.map((element, index) => 
                            <div key={index} className={"button filter-element" + (inMenu.includes(element) ? " active-button" : "")}
                                onClick={() => handleInMenuChange(element)}>
                                {element}
                            </div>
                        )}
                    </div>}
                </div>
            }
            {dict.cuisines_src &&
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
                        {dict.cuisines_src.map((element, index) => 
                            <div key={index} className={"button filter-element" + (cuisines.includes(element) ? " active-button" : "")}
                                onClick={() => handleCuisinesChange(element)}>
                                {element}
                            </div>
                        )}
                    </div>}
                </div>
            }
        </div>
    );
}
