import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { isMobilePhone, isMobilePhoneLocales, isEmail, isAlpha } from 'validator';
import axios from 'axios';
import moment from 'moment-timezone';
import jwt_axios from '../services/JWTaxios';
import Timer from 'react-compound-timer';

import Spinner from '../components/LoaderSpinner/Spinner';
import NotFound from './NotFound';

import '../reservation.css';

import AccountIcon from '../icons/account_icon.svg';
import StairsIcon from '../icons/stairs_icon.png';
import VipIcon from '../icons/vip_icon.png';
import PhoneIcon from '../icons/phone_icon.svg';
import CloseIcon from '../icons/close_icon.svg';
import DepositIcon from '../icons/deposit_icon.png';

import dict from '../dict.json';


export default function Reservation() {
    const history = useHistory();
    const isManager = history.location.state && history.location.state.from === 'Reservations';
    const [isLoading, setLoading] = useState(false);
    const [isChecking, setChecking] = useState(false);
    const [messages, setMessages] = useState({});
    const [notFound, setNotFound] = useState(false);
    const [isScopeLoading, setScopeLoading] = useState(false);

    const [isConfirmed, setConfirmed] = useState(false);
    const [isConfirming, setConfirming] = useState(false);
    const [isReserved, setReserved] = useState(false);

    const { city, title } = useParams();
    const [firstName, setFirstName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [comment, setComment] = useState("");
    const [chosenDateTime, setChosenDateTime] = useState("");
    const [tableSize, setTableSize] = useState(null);
    const [floors, setFloors] = useState([]);
    const [floor, setFloor] = useState(null);
    const [number, setNumber] = useState(null);

    const [isFirstNameValid, setFirstNameValid] = useState(false);
    const [isPhoneValid, setPhoneValid] = useState(false);
    const [isEmailValid, setEmailValid] = useState(false);
    const [isDateTimeValid, setDateTimeValid] = useState(false);
    const [isTableSizeValid, setTableSizeValid] = useState(false);

    const [place, setPlace] = useState({});
    const [tables, setTables] = useState([]);
    const [hoursTip, setHoursTip] = useState("");

    useEffect(() => {
        fetchUser();
        fetchPlace();
	}, []);

    const fetchUser = async () => {
        setLoading(true);

        await jwt_axios.get("/accounts/user/", {
            withCredentials: true
        }).then((response) => {
            firstNameValidator(response.data.first_name);
            phoneValidator(response.data.phone);
            emailValidator(response.data.email);
        }).finally(() => {
            setLoading(false);
        });
    }

    const fetchPlace = async () => {
        setLoading(true);
        setMessages({});

        await axios.get("/core/places/get/" + city + "/" + title + "/"
        ).then((response) => {
            setPlace(response.data);
            get_tables(response.data.id);
        }).catch((error) => {
            error.response.status === 404 && setNotFound(true);
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

    const get_tables = async (id) => {
        setLoading(true);
        
        await axios.get("/core/tables/" + id + "/"
        ).then((response) => {
            setTables(response.data);
            setFloors([null, ...Array.from(new Set(response.data.map(elem => elem.floor))).sort()]);
        }).finally(() => {
            setLoading(false);
        });
    }

    const filter_tables = async (guests, date_time, flr) => {
        setScopeLoading(true);
        
        await axios.post("/core/tables/filter/" + place.id + "/", {
            filters: {
                date_time: date_time,
                max_guests__gte: guests,
                min_guests__lte: guests,
                floor: flr
            }
        }).then((response) => {
            setTables(response.data);
        }).finally(() => {
            setScopeLoading(false);
        });
    }

    const reserve = async (id, number) => {
        setChecking(true);
        setMessages({});

        await jwt_axios.post("/reservations/create/" + place.id + "/" + id + "/", {
            date_time: chosenDateTime,
            guests: tableSize,
            manager: isManager
        }, {
            withCredentials: true
        }).then((response) => {
            setConfirmed(true);
            setNumber(number);
        }).catch((error) => {
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                (error.response &&
                    error.response.data) ||
                error.response ||
                error.toString()
            );
        }).finally(() => {
            setChecking(false);
        });
    }

    const confirm = async () => {
        setConfirming(true);
        setMessages({});

        await axios.post("/reservations/confirm/", {
            name: firstName,
            email: email,
            phone: phone,
            comment: comment
        }, {
            withCredentials: true
        }).then((response) => {
            setReserved(true);
        }).catch((error) => {
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                (error.response &&
                    error.response.data) ||
                error.response ||
                error.toString()
            );
        }).finally(() => {
            setConfirming(false);
        });
    }

    const cancel = async () => {
        setConfirmed(false);
        setNumber(null);

        await axios.post("/reservations/cancel/", {
            withCredentials: true
        });
    }

    const emailValidator = (value) => {
        setEmail(value);
        setEmailValid(isEmail(value));
    }

    const firstNameValidator = (value) => {
        setFirstName(value);
        setFirstNameValid(isAlpha(value) && value.length > 0 && value.length <= 150);
    }

    const phoneValidator = (value) => {
        setPhone(value);
        setPhoneValid(isMobilePhone(value, isMobilePhoneLocales, {strictMode: true}) && value.length > 0);
    }

    const dateTimeValidator = (value) => {
        setDateTime(value);
        if (!place.opening_hours) return;
        let chosen = moment.tz(value, place.timezone);
        let year = chosen.get('year');
        let month = chosen.get('month');
        let date = chosen.get('date');

        let today = chosen.isoWeekday() - 1;
        let yesterday = today - 1 === -1 ? 6 : today - 1;
        let today_min = moment.utc(place.opening_hours[today][0]).tz(place.timezone).set({"year": year, "month": month, "date": date});
        let today_max = moment.utc(place.opening_hours[today][1]).tz(place.timezone).set({"year": year, "month": month, "date": date});
        let yesterday_min = moment.utc(place.opening_hours[yesterday][0]).tz(place.timezone).set({"year": year, "month": month, "date": date});
        let yesterday_max = moment.utc(place.opening_hours[yesterday][1]).tz(place.timezone).set({"year": year, "month": month, "date": date});
        
        let tip = Number.isNaN(today_min._i) && Number.isNaN(today_max._i) ?
            ("В этот день выходной")
        :   ("В этот день: " + 
            (
                yesterday_min > yesterday_max && yesterday_max.format("HH:mm") !== "00:00"
                ?   "00:00 - " +  yesterday_max.format("HH:mm") + " и "
                :   ""
            ) + 
            today_min.format("HH:mm") + " - " + 
            (
                today_min > today_max
                ?   "24:00"
                :   today_max.format("HH:mm")
            ));
            
        let flag = chosen >= moment.tz(place.timezone) && (
            (yesterday_min >= yesterday_max && chosen < yesterday_max) ||
            (today_min >= today_max && chosen >= today_min) ||
            (chosen >= today_min && chosen < today_max));

        setHoursTip(tip);
        setChosenDateTime(chosen.format());
        setDateTimeValid(flag);
        flag && isTableSizeValid && filter_tables(tableSize, chosen.format(), floor);
    }

    const tableSizeValidator = (value) => {
        setTableSize(value);
        if (value >= 1) {
            setTableSizeValid(true);
            isDateTimeValid && filter_tables(value, chosenDateTime, floor);
        } else {
            setTableSizeValid(false);
        }
    }

	return (
        <div>
            {isLoading ?
                <Spinner />
            :   (notFound ?
                    <NotFound />
                :   <div className="auth">
                        {isChecking && <Spinner />}
                        {messages.non_field_errors &&
                            <div className="less-margin-auth-error">
                                {messages.non_field_errors}
                            </div>
                        }
                        {messages.statusText &&
                            <div className="less-margin-auth-error">
                                {messages.statusText}
                            </div>
                        }
                        {isConfirmed &&
                            <div className="confirm-back">
                                <div className="confirm-window">
                                    <div className="auth-logo">
                                        Foodcard
                                    </div>
                                    <div className="auth-title">
                                        Контактные данные
                                    </div>
                                    <div
                                        className="filter-close"
                                        onClick={() => isReserved ? (isManager ? history.push('/controlpanel/', { from: "Reservation-" + place.id }) : history.push('/place/' + city + '/' + title + '/')) : cancel()}
                                    >
                                        <img src={CloseIcon} alt="Close icon" draggable="false" />
                                    </div>
                                    {isConfirming ?
                                        <Spinner small={true} />
                                    :   <div>
                                            {messages.length > 0 &&
                                                <div className="less-margin-auth-error">
                                                    {messages}
                                                </div>
                                            }
                                            {isReserved ?
                                                <div className="reserved-info">
                                                    Стол №{number} на {tableSize}{tableSize <= 4 ? " гостя": " гостей"} на {moment.tz(chosenDateTime, place.timezone).format("D MMM YYYY, HH:mm")}
                                                    {" "}успешно зарезервирован. На вашу почту отправлено письмо с подтверждением
                                                    <div className="confirm-buttons">
                                                        <div tabIndex="0" className="button" onClick={() => isManager ? history.push('/controlpanel/', { from: "Reservation-" + place.id }) : history.push('/place/' + city + '/' + title + '/')}>Хорошо</div>
                                                    </div>
                                                </div>
                                            :   <div>
                                                    <div className="confirm-info">
                                                        Стол №{number} - {tableSize}{tableSize === 1 ? " гость" : (tableSize <= 4 ? " гостя": " гостей")} - {moment.tz(chosenDateTime, place.timezone).format("D MMM YYYY, HH:mm")}
                                                        <div>
                                                            У вас
                                                            <Timer
                                                                initialTime={300000}
                                                                direction="backward"
                                                                checkpoints={[
                                                                    {
                                                                        time: 0,
                                                                        callback: () => cancel(),
                                                                    },
                                                                ]}
                                                            >
                                                                <Timer.Minutes formatValue={value => ` ${value}:`} />
                                                                <Timer.Seconds formatValue={value => `${value} `}/>
                                                            </Timer>
                                                            для завершения резервации</div>
                                                    </div>
                                                    <div className="rrrow">
                                                        <div className="reservation-element el70">
                                                            <div className="form-element-title">
                                                                Имя
                                                            </div>
                                                            <input
                                                                type="text"
                                                                name="firstName"
                                                                className={isFirstNameValid ? "input-text" : "input-text invalid"}
                                                                value={firstName}
                                                                onChange={(e) => firstNameValidator(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="rrrow">
                                                        <div className="reservation-element el70">
                                                            <div className="form-element-title">
                                                                Телефон
                                                            </div>
                                                            <input
                                                                type="phone"
                                                                name="phone"
                                                                className={isPhoneValid ? "input-text" : "input-text invalid"}
                                                                value={phone}
                                                                onChange={(e) => phoneValidator(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="rrrow">
                                                        <div className="reservation-element el70">
                                                            <div className="form-element-title">
                                                                Почта
                                                            </div>
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                className={isEmailValid ? "input-text" : "input-text invalid"}
                                                                value={email}
                                                                onChange={(e) => emailValidator(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="rrrow">
                                                        <div className="reservation-element comment el70">
                                                            <div className="form-element-title">
                                                                Комментарий
                                                            </div>
                                                            <textarea
                                                                name="comment"
                                                                className="input-text"
                                                                value={comment}
                                                                maxlength="500"
                                                                onChange={(e) => setComment(e.target.value)}
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                    <div className="confirm-buttons">
                                                        <div tabIndex="0" className="button" onClick={() => cancel()}>Отмена</div>
                                                        {isPhoneValid && isFirstNameValid && isEmailValid ?
                                                            <div
                                                                tabIndex="0"
                                                                className="button active-button"
                                                                onClick={() => confirm()}
                                                                onKeyDown={(e) => e.key === 'Enter' && confirm()}
                                                            >
                                                                Зарезервировать
                                                            </div>
                                                        :   <div tabindex="0" className="button inactive">Зарезервировать</div>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                        <div className="reserve">
                            <div className="reservation-container">
                                <div className="auth-logo">
                                    Foodcard
                                </div>
                                <div className="auth-title">
                                    Резервация
                                </div>
                                <div className="place-info">
                                    <div className="rrrow">
                                        <div className="title">
                                            {place.title}
                                        </div>
                                        <div className="phone">
                                            <div className="button invert" onClick={() => window.open("tel:+" + place.phone.replace(/[^0-9]/g, ""), "_self")}>
                                                <img className="phone-icon" src={PhoneIcon} alt="Phone icon" />
                                                {place.phone}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rrrow">
                                        <div className="category">
                                            {place.main_category && dict.categories_src_dict[place.main_category.name]}
                                        </div>
                                        <div className="address">
                                            {place.country && dict.countries_src_dict[place.country.name] + ", " + dict.cities_src_dict[place.city] + ", " + place.street} 
                                        </div>
                                    </div>
                                </div>
                                <div className="rrow space-around">
                                    <div className="reservation-element guests">
                                        <div className="form-element-title">
                                            Гостей
                                        </div>
                                        <input
                                            type="number"
                                            name="number"
                                            className={isTableSizeValid ? "input-text" : "input-text invalid"}
                                            value={tableSize}
                                            min="1"
                                            onChange={(e) => {
                                                tableSizeValidator(Number.isNaN(parseInt(e.target.value)) ?
                                                    null
                                                :   (parseInt(e.target.value) < 0 ?
                                                        -parseInt(e.target.value)
                                                    :   parseInt(e.target.value)));
                                            }}
                                        />
                                    </div>
                                    <div className="reservation-element date-time">
                                        <div className="form-element-title">
                                            Дата и время 
                                        </div>
                                        <input
                                            type="datetime-local"
                                            name="reservation-time"
                                            className={isDateTimeValid ? "input-text" : "input-text invalid"}
                                            value={dateTime}
                                            onChange={(e) => dateTimeValidator(e.target.value)}
                                        ></input>
                                        <div className="hours-tip">
                                            {hoursTip}
                                        </div>
                                    </div>
                                    <div className="reservation-element floors">
                                        <div className="form-element-title">
                                            Этаж
                                        </div>
                                        <div className="floors-select">
                                            {floors.map((elem, index) => (
                                                <div
                                                    key={index}
                                                    className={"button floor" + (floor===elem ? " active-button" : "")}
                                                    onClick={() => {
                                                        setFloor(elem);
                                                        isTableSizeValid && isDateTimeValid && filter_tables(tableSize, chosenDateTime, elem);
                                                    }}
                                                >
                                                    {elem ? elem : 'Любой'}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="gallery reservation">
                                    {isScopeLoading ?
                                        <Spinner small={true} />
                                    :   (tables.length === 0 ?
                                            <div className="tip">
                                                Нет свободных столиков
                                            </div>
                                        :   tables.map((table, index, arr) => (
                                                <div 
                                                    key={index}
                                                    className="gallery-card table-card"
                                                    onClick={() => isTableSizeValid && isDateTimeValid && reserve(table.id, table.number)}
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
                                        )))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
		</div>
	);
}
