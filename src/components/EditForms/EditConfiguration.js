import React, { useState, useEffect } from 'react';
import jwt_axios from '../../services/JWTaxios';
import axios from 'axios';

import Spinner from '../LoaderSpinner/Spinner';

import AccountIcon from '../../icons/account_icon.svg';
import StairsIcon from '../../icons/stairs_icon.png';
import VipIcon from '../../icons/vip_icon.png';
import CloseIcon from '../../icons/close_icon.svg';
import DepositIcon from '../../icons/deposit_icon.png';


export default function EditConfiguration({ 
    place,
    setPlace
}) {
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [tables, setTables] = useState([]);
    const [popup, setPopup] = useState(false);

    const [id, setID] = useState(null);
    const [number, setNumber] = useState(null);
    const [isNumberValid, setNumberValid] = useState(false);
    const [maxGuests, setMaxGuests] = useState(null);
    const [isMaxGuestsValid, setMaxGuestsValid] = useState(false);
    const [minGuests, setMinGuests] = useState(null);
    const [isMinGuestsValid, setMinGuestsValid] = useState(false);
    const [floor, setFloor] = useState(1);
    const [deposit, setDeposit] = useState(null);
    const [isVip, setVip] = useState(false);
    const [image, setImage] = useState(null);


    useEffect(() => {
        get_tables();
    }, []);

    const get_tables = async () => {
        setLoading(true);
        
        await axios.get("/core/tables/" + place.id + "/"
        ).then((response) => {
            setTables(response.data);
        }).finally(() => {
            setLoading(false);
        });
    }

    const delete_table = async () => {
        setMessages({});

        await jwt_axios.post("/core/tables/delete/" + place.id + "/" + id + "/", {
            withCredentials: true 
        }).then((response) => {
            setTables(tables.filter((elem) => elem.id !== id));
            setPopup(true);
            add_table();
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

    const create_table = async () => {
        setMessages({});

        let formData = new FormData();
        formData.append("place", place.id);
        formData.append("number", number);
        formData.append("max_guests", maxGuests);
        formData.append("min_guests", minGuests ? minGuests : 1);
        formData.append("floor", floor);
        formData.append("deposit", deposit ? deposit : "");
        formData.append("is_vip", isVip);
        if (image !== null && typeof(image) === "object") formData.append("image", image);
        
        await jwt_axios.post("/core/tables/create/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true 
        }).then((response) => {
            setTables([...tables, response.data]);
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

    const update_table = async () => {
        setMessages({});
        
        let formData = new FormData();
        formData.append("number", number);
        formData.append("max_guests", maxGuests);
        formData.append("min_guests", minGuests ? minGuests : 1);
        formData.append("floor", floor);
        formData.append("deposit", deposit ? deposit : "");
        formData.append("is_vip", isVip);
        if (image === null) formData.append("delete_image", true);
        else if (typeof(image) === "object") formData.append("image", image);
        
        await jwt_axios.post("/core/tables/update/" + place.id + "/" + id + "/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        }).then((response) => {
            setTables([...tables.filter((elem) => elem.id !== id), response.data]);
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

    const add_table = () => {
        setID(null);
        setNumber(NaN);
        setNumberValid(false);
        setMaxGuests(NaN);
        setMaxGuestsValid(false);
        setMinGuests(NaN);
        setMinGuestsValid(false);
        setFloor(1);
        setDeposit(NaN);
        setVip(false);
        setImage(null);
    }

    const guestsValidator = (min, max) => {
        setMinGuests(min);
        setMaxGuests(max);
        setMinGuestsValid(min <= max || !min);
        setMaxGuestsValid((max >= min || Number.isNaN(min)) && max);
    }

    const numberValidator = (value) => {
        setNumber(value);
        setNumberValid(tables.filter(elem => elem.number === value && elem.id !== id).length === 0 && value);
    }

	return (
		<div>
            {isLoading ?
                <div className="margin-top">
                    <Spinner small={true} />
                </div>
            :   <div>
                    {popup &&
                        <div className="popup">
                            Конфигурация успешно изменена
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
                            onClick={() => add_table()}
                            onKeyDown={(e) => e.key === 'Enter' && add_table()}
                        >
                            Добавить стол
                        </div>
                        <div className="edit-form-title">
                            {id ? ("Стол №" + (number ? number : "")) : "Введите информацию о столе"}
                        </div>
                        <div class="border-top">
                            <div className="edit-scope">
                                
                                <div className="edit-row">
                                    <div className="label">
                                        Номер стола:
                                    </div>
                                    <input
                                        type="number"
                                        name="number"
                                        className={isNumberValid ? "input-text" : "input-text invalid"}
                                        value={number}
                                        onChange={(e) => numberValidator(Number.isNaN(parseInt(e.target.value)) ? null : parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="edit-row">
                                    <div className="label">
                                        Максимальное количество гостей:
                                    </div>
                                    <input
                                        type="number"
                                        name="max_guests"
                                        min="1"
                                        className={isMaxGuestsValid ? "input-text" : "input-text invalid"}
                                        value={maxGuests}
                                        onChange={(e) => {
                                            guestsValidator(minGuests, Number.isNaN(parseInt(e.target.value)) ?
                                                null
                                            :   (parseInt(e.target.value) < 0 ?
                                                    -parseInt(e.target.value)
                                                :   parseInt(e.target.value)))
                                        }}
                                    />
                                </div>
                                <div className="edit-row">
                                    <div className="label">
                                        Минимальное количество гостей:
                                    </div>
                                    <input
                                        type="number"
                                        name="min_guests"
                                        min="1"
                                        className={isMinGuestsValid || !minGuests ? "input-text" : "input-text invalid"}
                                        value={minGuests}
                                        onChange={(e) => {
                                            guestsValidator(Number.isNaN(parseInt(e.target.value)) ?
                                                null
                                            :   (parseInt(e.target.value) < 0 ?
                                                    -parseInt(e.target.value)
                                                :   parseInt(e.target.value)), maxGuests)
                                        }}
                                    />
                                </div>
                                <div className="edit-row">
                                    <div className="label">
                                        Этаж:
                                    </div>
                                    <input
                                        type="number"
                                        name="floor"
                                        min="1"
                                        className={floor ? "input-text" : "input-text invalid"}
                                        value={floor}
                                        onChange={(e) => setFloor(parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="edit-row">
                                    <div className="label">
                                        Депозит:
                                    </div>
                                    <input
                                        type="number"
                                        name="deposit"
                                        min="0"
                                        max="10000000"
                                        step="0.01"
                                        className="input-text"
                                        value={deposit}
                                        onChange={(e) => setDeposit(e.target.value < 0 ? -e.target.value : e.target.value)}
                                    />
                                </div>
                                <div className="edit-row">
                                    <div className="label">
                                        VIP-стол:
                                    </div>
                                    <label class="control control-checkbox">
                                        <input
                                            type="checkbox"
                                            name="vip"
                                            checked={isVip}
                                            onChange={() => setVip(!isVip)}
                                        />
                                        <div class="control_indicator"></div>
                                    </label>
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
                                        {image && (image.name || image.split('table_images/')[1])}
                                    </div>
                                    <div
                                        className="photo-unpin"
                                        onClick={() => setImage(null)}
                                    >
                                        <img src={CloseIcon} alt="Close icon" draggable="false" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row padding-none">
                            {id ?
                                <div
                                    tabindex="0"
                                    className="save delete"
                                    onClick={() => id ? delete_table() : add_table()}
                                    onKeyDown={(e) => e.key === 'Enter' && (id ? delete_table() : add_table())}
                                >
                                    Удалить
                                </div>
                            :   <div tabindex="0" className="button inactive">Удалить</div>
                            }
                            {isMaxGuestsValid && isMinGuestsValid && isNumberValid && floor ?
                                <div
                                    tabindex="0"
                                    className="save"
                                    onClick={() => id ? update_table() : create_table()}
                                    onKeyDown={(e) => e.key === 'Enter' && (id ? update_table() : create_table())}
                                >
                                    Сохранить
                                </div>
                            :   <div tabindex="0" className="button inactive">Сохранить</div>
                            }
                        </div>
                        <div className="gallery">
                            {tables && tables.map((table, index) => (
                                <div 
                                    key={index}
                                    className="gallery-card table-card"
                                    onClick={() => {
                                        setID(table.id);
                                        setNumber(table.number);
                                        setNumberValid(true);
                                        setMaxGuests(table.max_guests);
                                        setMaxGuestsValid(true);
                                        setMinGuests(table.min_guests);
                                        setMinGuestsValid(true);
                                        setFloor(table.floor);
                                        setDeposit(table.deposit);
                                        setVip(table.is_vip);
                                        setImage(table.image);
                                    }}
                                >
                                    <div className="gallery-card-photo">
                                        {table.image ?
                                            <img src={table.image} alt={"A photo of table №" + table.number} draggable="false" />
                                            :   <div className={"thumbnail-photo color" + Math.floor(Math.random() * Math.floor(7))}></div>
                                        }
                                    </div>
                                    {table.is_vip && 
                                        <div className="vip-icon">
                                            <img src={VipIcon} alt="Vip icon" draggable="false" />
                                        </div>        
                                    }
                                    <div className="table-row">
                                        <div className="gallery-card-number">
                                            Стол №{table.number}
                                        </div>
                                        <div className="gallery-card-seats">
                                            <img src={AccountIcon} alt="Account icon" draggable="false" />
                                            {table.min_guests === 1 || !table.min_guests ? table.max_guests : table.min_guests + "-" + table.max_guests}
                                        </div>
                                    </div>
                                    <div className="table-row last">
                                        <div className="gallery-card-floor">
                                            <img src={StairsIcon} alt="Stairs icon" draggable="false" />
                                            {table.floor}
                                        </div>
                                        {table.deposit &&
                                            <div className="gallery-card-deposit">
                                                <img src={DepositIcon} alt="Deposit icon" draggable="false" />
                                                {table.deposit}
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
		</div>
	);
}
