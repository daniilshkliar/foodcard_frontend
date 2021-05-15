import React, { useState, useEffect } from 'react';
import jwt_axios from '../../services/JWTaxios';
import axios from 'axios';

import Spinner from '../LoaderSpinner/Spinner';
import ShowMoreText from 'react-show-more-text';

import AccountIcon from '../../icons/account_icon.svg';
import StairsIcon from '../../icons/stairs_icon.png';
import VipIcon from '../../icons/vip_icon.png';
import CloseIcon from '../../icons/close_icon.svg';
import DepositIcon from '../../icons/deposit_icon.png';

import dict from '../../dict.json';


export default function EditMenu({ 
    place_id,
    setPlace
}) {
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [dishes, setDishes] = useState([]);
    const [popup, setPopup] = useState(false);

    const [id, setID] = useState(null);
    const [category, setCategory] = useState("csn");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(null);
    const [composition, setComposition] = useState("");

    const [weight, setWeight] = useState(null);
    const [proteins, setProteins] = useState(null);
    const [fats, setFats] = useState(null);
    const [carbohydrates, setCarbohydrates] = useState(null);
    const [calories, setCalories] = useState(null);

    const [image, setImage] = useState(null);


    useEffect(() => {
        get_dishes("csn");
    }, [place_id]);

    const get_dishes = async (category) => {
        setPopup(false);
        setLoading(true);
        
        await axios.get("/core/dishes/" + place_id + "/" + category + "/"
        ).then((response) => {
            setDishes(response.data);
        }).finally(() => {
            setLoading(false);
        });
    }

    const delete_dish = async () => {
        setMessages({});

        await jwt_axios.post("/core/dishes/delete/" + place_id + "/" + id + "/", {
            withCredentials: true 
        }).then((response) => {
            setDishes(dishes.filter((elem) => elem.id !== id));
            setPopup(true);
            add_dish();
        }).catch((error) => {
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response ||
                error.toString()
            );
            setPopup(false);
        });
    }

    const create_dish = async () => {
        setMessages({});

        let formData = new FormData();
        formData.append("place", place_id);
        formData.append("category", category);
        formData.append("title", title);
        formData.append("price", price);
        formData.append("composition", composition);
        formData.append("weight", weight !== null ? weight : "");
        formData.append("proteins", proteins !== null ? proteins : "");
        formData.append("fats", fats !== null ? fats : "");
        formData.append("carbohydrates", carbohydrates !== null ? carbohydrates : "");
        formData.append("calories", calories !== null ? calories : "");

        if (image !== null && typeof(image) === "object") formData.append("image", image);
        
        await jwt_axios.post("/core/dishes/create/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true 
        }).then((response) => {
            setDishes([...dishes, response.data]);
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
        });
    }

    const update_dish = async () => {
        setMessages({});
        
        let formData = new FormData();
        formData.append("category", category);
        formData.append("title", title);
        formData.append("price", price);
        formData.append("composition", composition);
        formData.append("weight", weight !== null ? weight : "");
        formData.append("proteins", proteins !== null ? proteins : "");
        formData.append("fats", fats !== null ? fats : "");
        formData.append("carbohydrates", carbohydrates !== null ? carbohydrates : "");
        formData.append("calories", calories !== null ? calories : "");

        if (image === null) formData.append("delete_image", true);
        else if (typeof(image) === "object") formData.append("image", image);
        
        await jwt_axios.post("/core/dishes/update/" + place_id + "/" + id + "/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        }).then((response) => {
            setDishes([...dishes.filter((elem) => elem.id !== id), response.data]);
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
        });
    }

    const add_dish = () => {
        setID(null);
        setTitle("");
        setPrice("");
        setComposition("");
        setWeight("");
        setProteins("");
        setFats("");
        setCarbohydrates("");
        setCalories("");
        setImage(null);
    }


	return (
		<div>
            <div>
                {popup &&
                    <div className="popup">
                        Блюдо успешно изменено
                    </div>
                }
                {messages.status &&
                    <div className="auth-error">
                        {messages.statusText}
                    </div>
                }
                <div className="edit-scope">
                    <div
                        tabindex="0"
                        className="button"
                        onClick={() => add_dish()}
                        onKeyDown={(e) => e.key === 'Enter' && add_dish()}
                    >
                        Добавить блюдо
                    </div>
                    <div className="edit-form-title">
                        Информация о блюде
                    </div>
                    {dict.menu_categories &&
                        <div className="filter-body margin-bottom">
                            {dict.menu_categories.map((element, index) => 
                                <div key={index} className={"button filter-element" + (category === element[0] ? " active-button" : "")}
                                    onClick={() => {
                                        setCategory(element[0]);
                                        get_dishes(element[0]);
                                    }}>
                                    {element[1]}
                                </div>
                            )}
                        </div>
                    }
                    <div class="border-top">
                        <div className="edit-scope">
                            <div className="edit-row">
                                <div className="label">
                                    Название:
                                </div>
                                <input
                                    type="text"
                                    name="title"
                                    maxlength="70"
                                    className={title.length > 0 ? "input-text" : "input-text invalid"}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="edit-row">
                                <div className="label">
                                    Цена:
                                </div>
                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    max="10000000"
                                    step="0.01"
                                    className={price ? "input-text" : "input-text invalid"}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value < 0 ? -e.target.value : e.target.value)}
                                />
                            </div>
                            <div className="edit-row">
                                <div className="label">
                                    Вес порции, г:
                                </div>
                                <input
                                    type="number"
                                    name="weight"
                                    className="input-text"
                                    min="0"
                                    value={weight}
                                    onChange={(e) => {
                                        setWeight(Number.isNaN(parseInt(e.target.value)) ?
                                            null
                                        :   (parseInt(e.target.value) < 0 ?
                                                -parseInt(e.target.value)
                                            :   parseInt(e.target.value)))
                                    }}
                                />
                            </div>
                            <div className="edit-row">
                                <div className="label">
                                    Калорийность порции, ккал:
                                </div>
                                <input
                                    type="number"
                                    name="calories"
                                    className="input-text"
                                    min="0"
                                    value={calories}
                                    onChange={(e) => {
                                        setCalories(Number.isNaN(parseInt(e.target.value)) ?
                                            null
                                        :   (parseInt(e.target.value) < 0 ?
                                                -parseInt(e.target.value)
                                            :   parseInt(e.target.value)))
                                    }}
                                />
                            </div>
                            <div className="edit-row">
                                <div className="label">
                                    Количество жиров в порции, г:
                                </div>
                                <input
                                    type="number"
                                    name="fats"
                                    className="input-text"
                                    min="0"
                                    value={fats}
                                    onChange={(e) => {
                                        setFats(Number.isNaN(parseInt(e.target.value)) ?
                                            null
                                        :   (parseInt(e.target.value) < 0 ?
                                                -parseInt(e.target.value)
                                            :   parseInt(e.target.value)))
                                    }}
                                />
                            </div>
                            <div className="edit-row">
                                <div className="label">
                                    Количество белков в порции, г:
                                </div>
                                <input
                                    type="number"
                                    name="proteins"
                                    className="input-text"
                                    min="0"
                                    value={proteins}
                                    onChange={(e) => {
                                        setProteins(Number.isNaN(parseInt(e.target.value)) ?
                                            null
                                        :   (parseInt(e.target.value) < 0 ?
                                                -parseInt(e.target.value)
                                            :   parseInt(e.target.value)))
                                    }}
                                />
                            </div>
                            <div className="edit-row">
                                <div className="label">
                                    Количество углеводов в порции, г:
                                </div>
                                <input
                                    type="number"
                                    name="carbohydrates"
                                    className="input-text"
                                    min="0"
                                    value={carbohydrates}
                                    onChange={(e) => {
                                        setCarbohydrates(Number.isNaN(parseInt(e.target.value)) ?
                                            null
                                        :   (parseInt(e.target.value) < 0 ?
                                                -parseInt(e.target.value)
                                            :   parseInt(e.target.value)))
                                    }}
                                />
                            </div>
                            <div className="edit-row composition">
                                <div className="label">
                                    Состав:
                                </div>
                                <textarea
                                    name="composition"
                                    maxlength="300"
                                    className="input-text menu-textarea"
                                    value={composition}
                                    onChange={(e) => setComposition(e.target.value)}
                                />
                            </div>
                            <div className="edit-row">
                                <label for="photo" className="button active-button">Выбрать фото</label>
                                <input
                                    type="file"
                                    id="photo"
                                    accept="image/png, image/jpeg"
                                    hidden
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                                <div className="label small-font">
                                    {image && (image.name || image.split('menu_images/')[1])}
                                </div>
                                <div
                                    className="photo-unpin"
                                    onClick={() => setImage(null)}
                                >
                                    {image && <img src={CloseIcon} alt="Close icon" draggable="false" />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row padding-none">
                        {id ?
                            <div
                                tabindex="0"
                                className="save delete"
                                onClick={() => Number.isNaN(id) || !id ? add_dish() : delete_dish()}
                                onKeyDown={(e) => e.key === 'Enter' && (Number.isNaN(id) || !id ? add_dish() : delete_dish())}
                            >
                                Удалить
                            </div>
                        :   <div tabindex="0" className="button inactive">Удалить</div>
                        }
                        {title.length > 0 && price && category ?
                            <div
                                tabindex="0"
                                className="save"
                                onClick={() => Number.isNaN(id) || !id ? create_dish() : update_dish()}
                                onKeyDown={(e) => e.key === 'Enter' && (Number.isNaN(id) || !id ? create_dish() : update_dish())}
                            >
                                Сохранить
                            </div>
                        :   <div tabindex="0" className="button inactive">Сохранить</div>
                        }
                    </div>
                    <div className="gallery">
                        {isLoading ?
                            <div className="margin-top">
                                <Spinner small={true} />
                            </div>
                        :   dishes && dishes.length > 0 ?
                                dishes.map((dish, index) => (
                                    <div 
                                        key={index}
                                        className="menu-card clickable"
                                        onClick={() => {
                                            setID(dish.id);
                                            setTitle(dish.title);
                                            setPrice(dish.price);
                                            setComposition(dish.composition);
                                            setWeight(dish.weight);
                                            setProteins(dish.proteins);
                                            setFats(dish.fats);
                                            setCarbohydrates(dish.carbohydrates);
                                            setCalories(dish.calories);
                                            setImage(dish.image);
                                        }}
                                    >
                                        <div className="menu-card-photo">
                                            {dish.image && <img src={dish.image} alt={"A photo of " + dish.title} draggable="false" />}
                                        </div>
                                        <div className="reservations-list-element-column">
                                            <div className="reservations-list-element-row menu-card-main">
                                                <div className="menu-card-title">
                                                    {dish.title}
                                                </div>
                                                <div className="menu-card-price">
                                                    {dish.weight &&
                                                        <div className="menu-card-weight">
                                                            {dish.weight}г
                                                        </div>
                                                    }
                                                    {dish.price}
                                                </div>
                                            </div>
                                            {dish.composition &&
                                                <div className="reservations-list-element-row">
                                                    <div className="menu-card-composition">
                                                        <ShowMoreText
                                                            lines={2}
                                                            anchorClass='show-more'
                                                        >
                                                            {dish.composition}
                                                        </ShowMoreText>
                                                    </div>
                                                </div>
                                            }
                                            <div className="reservations-list-element-row nutrients">
                                                <div className="reservations-list-element-column menu-card-nutrients">
                                                    <div className="menu-card-nutrients-header">
                                                        калории
                                                    </div>
                                                    <div className="menu-card-nutrients-body">
                                                        {dish.calories !== null ? dish.calories : "-"}
                                                    </div>
                                                </div>
                                                <div className="reservations-list-element-column menu-card-nutrients">
                                                    <div className="menu-card-nutrients-header">
                                                        жиры
                                                    </div>
                                                    <div className="menu-card-nutrients-body">
                                                        {dish.fats !== null ? dish.fats : "-"}
                                                    </div>
                                                </div>
                                                <div className="reservations-list-element-column menu-card-nutrients">
                                                    <div className="menu-card-nutrients-header">
                                                        белки
                                                    </div>
                                                    <div className="menu-card-nutrients-body">
                                                        {dish.proteins !== null ? dish.proteins : "-"}
                                                    </div>
                                                </div>
                                                <div className="reservations-list-element-column menu-card-nutrients">
                                                    <div className="menu-card-nutrients-header">
                                                        углеводы
                                                    </div>
                                                    <div className="menu-card-nutrients-body">
                                                        {dish.carbohydrates !== null ? dish.carbohydrates : "-"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            :   <div className="tip margin-bottom">Блюд нет</div>
                        }
                    </div>
                </div>
            </div>
		</div>
	);
}
