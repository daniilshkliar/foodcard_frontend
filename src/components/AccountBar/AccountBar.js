import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_axios from '../../services/JWTaxios';
import moment from 'moment-timezone';

import Spinner from '../LoaderSpinner/Spinner';

import './accountBar.css';

import ArrowDownIcon from '../../icons/arrow_down_icon.svg';
import CloseIcon from '../../icons/close_icon.svg';
import ArrowUpIcon from '../../icons/arrow_up_icon.svg';


export default function AccountBar() {
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const [isFavoriteLoading, setFavoriteLoading] = useState(false);
    const [random, setRandom] = useState(0);
    const [isStaff, setStaff] = useState(false);
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [messages, setMessages] = useState({});
    const [isFavoriteActive, setFavoriteActive] = useState(false);
    const [isActive, setActive] = useState(true);
    const [recentReservations, setRecentReservations] = useState([]);
    const [activeReservations, setActiveReservations] = useState([]);
    const [isReservationsLoading, setReservationsLoading] = useState(true);
    const [isDeleting, setDeleting] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    const [isDeleteReservation, setDeleteReservation] = useState(false);


    useEffect(() => {
        fetchUser();
	}, []);

    const fetchUser = async () => {
        setLoading(true);
        setMessages({});

        await jwt_axios.get("/accounts/user/", {
            withCredentials: true
        }).then((response) => {
            setStaff(response.data.is_staff);
            setEmail(response.data.email);
            setPhone(response.data.phone);
            setFirstName(response.data.first_name);
            setLastName(response.data.last_name);
            setRandom(Math.floor(Math.random() * 7));
            fetchFavorites();
            getReservations();
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

    const fetchFavorites = async () => {
        setFavoriteLoading(true);
        setMessages({});

        await jwt_axios.get("/core/favorites/", {
            withCredentials: true
        }).then((response) => {
            setFavorites(response.data);
        }).catch((error) => {
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response ||
                error.toString()
            );
        }).finally(() => {
            setFavoriteLoading(false);
        });
    }

    const logout = async () => {
        setMessages({});

        await jwt_axios.post("/accounts/logout/", {
            withCredentials: true
        }).then((response) => {
            setStaff(false);
            setEmail("");
            setPhone("");
            setFirstName("");
            setLastName("");
        }).catch((error) => {
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response ||
                error.toString()
            );
        });
    }

    const editProfile = () => {

    }

    const getReservations = async () => {
        setReservationsLoading(true);

        await jwt_axios.get("/reservations/list_by_user/", {
            withCredentials: true
        }).then((response) => {
            setActiveReservations(response.data.filter(elem => moment.utc(elem.date_time).tz(elem.place.split('-')[0]) >= moment().tz(elem.place.split('-')[0])));
            setRecentReservations(response.data.filter(elem => moment.utc(elem.date_time).tz(elem.place.split('-')[0]) < moment().tz(elem.place.split('-')[0])));
        }).finally(() => {
            setReservationsLoading(false);
        });
    }

    const deleteReservation = async () => {
        setDeleting(true);

        await jwt_axios.post("/reservations/delete/" + deleteID + "/", {
            withCredentials: true
        }).then((response) => {
            setActiveReservations(activeReservations.filter(elem => elem.id !== deleteID))
        }).finally(() => {
            setDeleteID(null);
            setDeleteReservation(false);
            setDeleting(false);
        });
    }

	return (
        <div>
            {isLoading ?
                <Spinner />
            :   <div className="account-bar">
                    {phone ?
                        <div className="account">
                            {isDeleteReservation &&
                                <div className="reservation-delete-background">
                                    <div className="reservation-delete-window">
                                        <div
                                            className="filter-close"
                                            onClick={() => {
                                                setDeleteReservation(false);
                                                setDeleteID(null);
                                            }}
                                        >
                                            <img src={CloseIcon} alt="Close icon" draggable="false" />
                                        </div>
                                        {isDeleting ?
                                            <Spinner small={true} />
                                        :   <div className="delete-info">
                                                Вы действительно хотите отменить резервацию?
                                                <div className="confirm-buttons">
                                                    <div tabIndex="0" className="button cancel-button" onClick={() => deleteReservation()}>Да</div>
                                                    <div tabIndex="0" className="button" onClick={() => {
                                                        setDeleteReservation(false);
                                                        setDeleteID(null);
                                                    }}>
                                                        Нет
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                            {phone &&
                                <div className={"user-avatar color" + random}>
                                    {firstName.charAt(0).toUpperCase()}
                                </div>
                            }
                            <div className="account-row">{firstName}</div>
                            <div className="account-row">{lastName}</div>
                            <div className="account-row">{phone}</div>
                            <div className="account-row">{email}</div>
                            <div className="account-scope">
                                {/* <div className="button" onClick={() => editProfile()}>Редактировать</div> */}
                                <div className="button" onClick={() => logout()}>Выйти</div>
                            </div>
                            <div className="account-scope">
                                <div className="account-scope-header clickable" onClick={() => setFavoriteActive(!isFavoriteActive)}>
                                    Избранные
                                    <div className="invert arrow">
                                        {isFavoriteActive ?
                                        <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                                        : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                                        }
                                    </div>
                                </div>
                                {isFavoriteActive &&
                                    <div className="fav-button-panel">
                                        {isFavoriteLoading ?
                                            <Spinner small={true} />
                                        :   (favorites.length > 0 ?
                                                (favorites.map((elem, index) => (
                                                    <div key={index} className="">
                                                        <div className="button orange-button" onClick={() => history.push("/place/" + elem.place)}>
                                                            {elem.place.split('/')[1]}
                                                        </div>
                                                    </div>
                                                )))
                                            :   <div className="tip">
                                                    У вас нет избранных мест
                                                </div>
                                            )
                                        }
                                    </div>
                                }
                            </div>
                            {isStaff &&
                                <div className="account-scope">
                                    <div className="button active-button" onClick={() => history.push("/controlpanel/")}>Панель управления</div>
                                </div>
                            }
                            <div className="account-scope">
                                {isReservationsLoading ?
                                    <Spinner small={true} />
                                :   <div>
                                        <div className="account-row">
                                            <div className={!isActive ? "swipe active-underline" : "swipe"} onClick={() => setActive(false)}>Последние</div>
                                            <div className={isActive ? "swipe active-underline" : "swipe"} onClick={() => setActive(true)}>Активные</div>
                                        </div>
                                        {isActive ?
                                            activeReservations.length === 0 ?
                                                <div className="tip reservations-margin-top">Активных резерваций нет</div>
                                            :   activeReservations.map((elem, index) =>
                                                    <div className="reservation-list-element">
                                                        <div key={index} className="account-row flex-wrap">
                                                            <div className="reservation-date">
                                                                {moment.utc(elem.date_time).tz(elem.place.split('-')[0]).format("D MMM YYYY, HH:mm")}
                                                            </div>
                                                            <div className="reservation-place" onClick={() => history.push('/place/' + elem.place.split('-')[1])}>
                                                                {elem.place.split('-')[1].split('/')[1]}
                                                            </div>
                                                            <div className="reservation-table">
                                                                , стол №{elem.table}
                                                            </div>
                                                            <div className="reservation-guests">
                                                                {elem.guests}{elem.guests === 1 ? " гость" : (elem.guests <= 4 ? " гостя": " гостей")}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="reservation-delete"
                                                            onClick={() => {
                                                                setDeleteID(elem.id);
                                                                setDeleteReservation(true);
                                                            }}
                                                        >
                                                            <img src={CloseIcon} alt="Close icon" draggable="false" />
                                                        </div>
                                                    </div>
                                                )
                                        :   recentReservations.length === 0 ?
                                                <div className="tip reservations-margin-top">Последних резерваций нет</div>
                                            :   recentReservations.map((elem, index) =>
                                                    <div className="reservation-list-element">
                                                        <div key={index} className="account-row flex-wrap">
                                                            <div className="reservation-date">
                                                                {moment.utc(elem.date_time).tz(elem.place.split('-')[0]).format("D MMM YYYY, HH:mm")}
                                                            </div>
                                                            <div className="reservation-place" onClick={() => history.push('place/' + elem.place.split('-')[1])}>
                                                                {elem.place.split('-')[1].split('/')[1]}
                                                            </div>
                                                            <div className="reservation-table">
                                                                , стол №{elem.table}
                                                            </div>
                                                            <div className="reservation-guests">
                                                                {elem.guests}{elem.guests === 1 ? " гость" : (elem.guests <= 4 ? " гостя": " гостей")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    :   <div className="account">
                            <div className="button active-button" onClick={() => history.push("/login/")}>Войти</div>
                            <div className="button active-button" onClick={() => history.push("/signup/")}>Зарегистрироваться</div>
                        </div>
                    }
                </div>
            }
		</div>
	);
}
