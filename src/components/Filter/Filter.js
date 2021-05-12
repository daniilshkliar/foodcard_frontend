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
                        onClick={() => setSortMode(1)}>
                        Рейтингу
                    </div>
                    <div className={"button filter-element" + (sortMode===2 ? " active-button" : "")}
                        onClick={() => setSortMode(2)}>
                        Популярности
                    </div>
                    <div className={"button filter-element" + (sortMode===3 ? " active-button" : "")}
                        onClick={() => setSortMode(3)}>
                        Расстоянию от меня
                    </div>
                </div>
            </div>
            <div className="filter-box">
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
            </div>
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
                            <div key={index} className={"button filter-element" + (categories.includes(element[0]) ? " active-button" : "")}
                                onClick={() => handleCategoriesChange(element[0])}>
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
                            <div key={index} className={"button filter-element" + (cuisines.includes(element[0]) ? " active-button" : "")}
                                onClick={() => handleCuisinesChange(element[0])}>
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
                            <div key={index} className={"button filter-element" + (additionalServices.includes(element[0]) ? " active-button" : "")}
                                onClick={() => handleAdditionalServicesChange(element[0])}>
                                {element[1]}
                            </div>
                        )}
                    </div>}
                </div>
            }
        </div>
    );
}
