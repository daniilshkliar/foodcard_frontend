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
    fetchPlaces,
    setSearchQuery,
    }) {

    const [isCountryActive, setCountryActive] = useState(false);
    const [isCityActive, setCityActive] = useState(false);
    const [isCategoryActive, setCategoryActive] = useState(true);
    const [isCuisineActive, setCuisineActive] = useState(false);
    const [isAdditionalServicesActive, setAdditionalServicesActive] = useState(false);
    const [isInMenuActive, setInMenuActive] = useState(false);

    const handleCategoriesChange = (element) => {
        let array = []
        categories.includes(element) ?
            array = [...categories.filter(elem => elem !== element)]
        :   array = [...categories, element];
        setCategories(array);
        setSearchQuery("");
        fetchPlaces(1, array, cuisines, additionalServices, country, city);                     
    }

    const handleCuisinesChange = (element) => {
        let array = []
        cuisines.includes(element) ?
            array = [...cuisines.filter(elem => elem !== element)]
        :   array = [...cuisines, element];  
        setCuisines(array);
        setSearchQuery("");
        fetchPlaces(1, categories, array, additionalServices, country, city);                               
    }

    const handleAdditionalServicesChange = (element) => {
        let array = []
        additionalServices.includes(element) ?
            array = [...additionalServices.filter(elem => elem !== element)]
        :   array = [...additionalServices, element];    
        setAdditionalServices(array);
        setSearchQuery("");
        fetchPlaces(1, categories, cuisines, array, country, city);                               
    }

    const handleInMenuChange = (element) => {
        let array = []
        inMenu.includes(element) ?
            array = [...inMenu.filter(elem => elem !== element)]
        :   array = [...inMenu, element]; 
        setInMenu(array);
        setSearchQuery("");
        fetchPlaces(1, categories, cuisines, additionalServices, country, city);                                   
    }

    const fetchCountryCoordinates = async (ctr) => {
        const data = await axios(
            "https://geocode-maps.yandex.ru/1.x/?apikey=d08fc50d-a7e6-4f37-bc51-1eb5df129e9d&format=json&geocode=" + ctr
        );
        setSearchQuery("");
        setCoordinates([...data.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(el => parseInt(el)).reverse()]);
    }

    const fetchCityCoordinates = async (ctr, cty) => {
        const data = await axios(
            "https://geocode-maps.yandex.ru/1.x/?apikey=d08fc50d-a7e6-4f37-bc51-1eb5df129e9d&format=json&geocode=" + ctr + "+" + cty
        );
        setSearchQuery("");
        setCoordinates([...data.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(el => parseFloat(el)).reverse()]);
        fetchPlaces(1, categories, cuisines, additionalServices, ctr, cty);
    }

    return (
        <div className="filter">
            <div className="main-filter-header">
                Все фильтры
            </div>
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
                                    setCountry(element.country[0]);
                                    country!==element.country[0] && setCity("");
                                    fetchCountryCoordinates(element.country[0]);
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
                                                setCity(element[0]);
                                                fetchCityCoordinates(country, element[0]);
                                            }}
                                        >
                                        {element[1]}
                                    </div>
                            )}
                        </div>
                    }
                </div>
            }
            <div className="filter-box">
                <div className="filter-header">
                    Сортировать по
                </div>
                <div className="filter-body">
                    <div className={"button filter-element" + (sortMode===1 ? " active-button" : "")}
                        onClick={() => {
                            setSortMode(1);
                            fetchPlaces(1, categories, cuisines, additionalServices, country, city, "", 1);
                        }}>
                        Количеству отзывов
                    </div>
                    <div className={"button filter-element" + (sortMode===2 ? " active-button" : "")}
                        onClick={() => {
                            setSortMode(2);
                            fetchPlaces(1, categories, cuisines, additionalServices, country, city, "", 2);
                        }}>
                        Рейтингу
                    </div>
                    <div className={"button filter-element" + (sortMode===3 ? " active-button" : "")}
                        onClick={() => {
                            setSortMode(3);
                            fetchPlaces(1, categories, cuisines, additionalServices, country, city, "", 3);
                        }}>
                        Названию
                    </div>
                    {/* <div className={"button filter-element" + (sortMode===3 ? " active-button" : "")}
                        onClick={() => setSortMode(3)}>
                        Расстоянию от меня
                    </div> */}
                </div>
            </div>
            {/* <div className="filter-box">
                <div className="filter-header">
                    Открыто
                </div>
                <div className="filter-body">   
                    <div className={"button filter-element" + (open===1 ? " active-button" : "")}
                        onClick={() => setOpen(open===1 ? 0 : 1)}>
                        Еще 3 часа
                    </div>
                    <div className={"button filter-element" + (open===2 ? " active-button" : "")}
                        onClick={() => setOpen(open===2 ? 0 : 2)}>
                        Сегодня
                    </div>
                    <div className={"button filter-element" + (open===3 ? " active-button" : "")}
                        onClick={() => setOpen(open===3 ? 0 : 3)}>
                        Завтра
                    </div>
                    <div className={"button filter-element" + (open===4 ? " active-button" : "")}
                        onClick={() => setOpen(open===4 ? 0 : 4)}>
                        Круглосуточно
                    </div>
                </div>
            </div> */}
            {dict.categories_src &&
                <div className="filter-box">
                    <div className="filter-header clickable" onClick={() => setCategoryActive(!isCategoryActive)}>
                        Категория
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
                            <div key={index} className={"button filter-element" + (categories.includes(index+1) ? " active-button" : "")}
                                onClick={() => handleCategoriesChange(index+1)}>
                                {element[1]}
                            </div>
                        )}
                    </div>}
                </div>
            }
            {dict.inmenu_src &&
                <div className="filter-box">
                    <div className="filter-header clickable" onClick={() => setInMenuActive(!isInMenuActive)}>
                        В меню
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
                        Кухня
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
                            <div key={index} className={"button filter-element" + (cuisines.includes(index+1) ? " active-button" : "")}
                                onClick={() => handleCuisinesChange(index+1)}>
                                {element[1]}
                            </div>
                        )}
                    </div>}
                </div>
            }
            {dict.additional_src &&
                <div className="filter-box">
                    <div className="filter-header clickable" onClick={() => setAdditionalServicesActive(!isAdditionalServicesActive)}>
                        Дополнительно
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
                            <div key={index} className={"button filter-element" + (additionalServices.includes(index+1) ? " active-button" : "")}
                                onClick={() => handleAdditionalServicesChange(index+1)}>
                                {element[1]}
                            </div>
                        )}
                    </div>}
                </div>
            }
        </div>
    );
}
