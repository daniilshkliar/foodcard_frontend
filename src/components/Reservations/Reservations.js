import React, { useState, useEffect, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_axios from '../../services/JWTaxios';
import axios from 'axios';
import ShowMoreText from 'react-show-more-text';
import moment from 'moment-timezone';

import Spinner from '../LoaderSpinner/Spinner';
import Reservation from '../../screens/Reservation';

import AccountIcon from '../../icons/account_icon.svg';
import StairsIcon from '../../icons/stairs_icon.png';
import VipIcon from '../../icons/vip_icon.png';
import CloseIcon from '../../icons/close_icon.svg';
import ArrowUpIcon from '../../icons/arrow_up_icon.svg';
import DepositIcon from '../../icons/deposit_icon.png';
import PhoneIcon from '../../icons/phone_icon.svg';


export default function Reservations({ 
    place,
    setPlace
}) {
    const history = useHistory();
    const scrollRef = createRef();
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState(1);
    const [dateTime, setDateTime] = useState(moment.tz(place.timezone).format("YYYY-MM-DD"));
    const [reservations, setReservations] = useState([]);
    const [deleteID, setDeleteID] = useState(null);
    const [isDeleting, setDeleting] = useState(false);
    const [isDeleteReservation, setDeleteReservation] = useState(false);
    const [isElevatorActive, setElevator] = useState(false);
    const [isReservationsLoading, setReservationsLoading] = useState(false);


    useEffect(() => {
        getReservations(moment.tz(place.timezone).format("YYYY-MM-DD"), 1);
    }, [place]);

    const deleteReservation = async () => {
        setDeleting(true);

        await jwt_axios.post("/reservations/delete/" + deleteID + "/", {
            withCredentials: true
        }).then((response) => {
            setReservations(reservations.filter(elem => elem.id !== deleteID))
        }).finally(() => {
            setDeleteID(null);
            setDeleteReservation(false);
            setDeleting(false);
        });
    }

    const getReservations = async (date_time, page) => {
        setReservationsLoading(true);
        setMessages({});

        await jwt_axios.get('/reservations/list_by_place/' + place.id + '/?date_time=' + date_time + '&page=' + page, {
            withCredentials: true 
        }).then((response) => {
            if (page === 1) setReservations(response.data.results);
            else setReservations([...reservations, ...response.data.results]);
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
            setReservationsLoading(false);
        });
    }

	return (
		<div>
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
            <div className="edit-scope">
                <div
                    tabindex="0"
                    className="button"
                    onClick={() => history.push('/reservation/' + place.city + '/' + place.title + '/', { from: "Reservations" })}
                    onKeyDown={(e) => e.key === 'Enter' && history.push('/reservation/' + place.city + '/' + place.title + '/', { from: "Reservations" })}
                >
                    Создать резервацию
                </div>
                <div className="edit-form-title">
                    Список резерваций
                </div>
                <div
                    class="reservations-scope"
                    ref={scrollRef}
                    onScroll={() => {
                        setElevator(scrollRef.current.scrollTop >= 800);
                        if (nextPage && scrollRef.current.scrollHeight - scrollRef.current.scrollTop === scrollRef.current.clientHeight) {
                            getReservations(dateTime, nextPage);
                        }
                    }}
                >
                    <div className="reservation-element date-time reservations-list">
                        <input
                            type="date"
                            name="reservation-time"
                            className="input-text"
                            value={dateTime}
                            onChange={(e) => {
                                setNextPage(1);                                   
                                setDateTime(e.target.value);
                                getReservations(e.target.value, 1);
                            }}
                        ></input>
                    </div>
                    <div>
                        {!isReservationsLoading && (reservations.length === 0 ?
                            <div className="tip reservations-margin-top">
                                На этот день резерваций нет
                            </div>
                        :   reservations.map((elem, index) => (
                                <div key={index} className="reservations-list-element-row reservations-list-card">
                                    {moment.utc(elem.date_time).tz(place.timezone) < moment.tz(place.timezone) &&
                                        <div className="past-reservations"></div>
                                    }
                                    <div className="reservations-list-element-column">
                                        <div className="reservations-list-element-row">
                                            <div className="reservations-list-time">
                                                {moment.utc(elem.date_time).tz(place.timezone).format("HH:mm")}
                                            </div>
                                            <div className="reservations-list-element-column el-table">
                                                <div className="reservations-list-table">
                                                    Стол №{elem.table}
                                                </div>
                                                <div className="reservations-list-guests">
                                                    {elem.guests}{elem.guests === 1 ? " гость" : (elem.guests <= 4 ? " гостя": " гостей")}
                                                </div>
                                            </div>
                                            <div className="reservations-list-element-column el-name">
                                                <div className="reservations-list-name">
                                                    {elem.name}
                                                </div>
                                                <div className="reservations-list-email">
                                                    {elem.email}
                                                </div>
                                            </div>
                                            <div className="reservations-list-phone">
                                                <div className="button invert" onClick={() => window.open("tel:+" + elem.phone.replace(/[^0-9]/g, ""), "_self")}>
                                                    <img className="phone-icon" src={PhoneIcon} alt="Phone icon" />
                                                    {elem.phone}
                                                </div>
                                            </div>
                                            <div
                                                className="reservations-list-delete"
                                                onClick={() => {
                                                    if (moment.utc(elem.date_time).tz(place.timezone) >= moment.tz(place.timezone)) {
                                                        setDeleteID(elem.id);
                                                        setDeleteReservation(true);
                                                    }
                                                }}
                                            >
                                                {moment.utc(elem.date_time).tz(place.timezone) >= moment.tz(place.timezone) &&
                                                    <img src={CloseIcon} alt="Close icon" draggable="false" />}
                                            </div>
                                        </div>
                                        <div className="reservations-list-comment reservations-list-element-row">
                                            <div className="reservations-list-comment-title">
                                                Комментарий:
                                            </div>
                                            <ShowMoreText
                                                lines={1}
                                                anchorClass='show-more'
                                                className="reservations-list-comment-text"
                                            >
                                                {elem.comment ? elem.comment : "Нет"}
                                            </ShowMoreText>
                                        </div>
                                    </div>
                                    
                                </div>
                            ))
                        )}
                        {isReservationsLoading && <Spinner small={true} />}
                        {isElevatorActive && 
                            <div className="elevator" onClick={() => scrollRef.current.scrollTo(0, 0)}>
                                <img src={ArrowUpIcon} alt="Arrow up icon" draggable="false" />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}