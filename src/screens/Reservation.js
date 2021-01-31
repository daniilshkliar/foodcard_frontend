import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { isMobilePhone, isMobilePhoneLocales, isEmail, isAlpha } from 'validator';
import axios from 'axios';
import moment from 'moment-timezone';
import jwt_axios from '../services/JWTaxios';

import Spinner from '../components/LoaderSpinner/Spinner';
import NotFound from './NotFound';

import '../reservation.css';


export default function Reservation() {
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const [isChecking, setChecking] = useState(false);
    const [messages, setMessages] = useState({});
    const [notFound, setNotFound] = useState(false);
    const { city, title } = useParams();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [comment, setComment] = useState("");
    const [chosenDateTime, setChosenDateTime] = useState("");
    const [tableSize, setTableSize] = useState();
    const [isReserved, setReserved] = useState(false);
    const [isFirstNameValid, setFirstNameValid] = useState(false);
    const [isPhoneValid, setPhoneValid] = useState(false);
    const [isDateTimeValid, setDateTimeValid] = useState(false);
    const [isTableSizeValid, setTableSizeValid] = useState(false);
    const [place, setPlace] = useState({});
    const [hoursTip, setHoursTip] = useState("");

    useEffect(() => {
        fetchUser();
        fetchPlace();
	}, []);

    const fetchUser = async () => {
        setLoading(true);

        await jwt_axios.get("/authentication/user/get/", {
            withCredentials: true
        }).then((response) => {
            firstNameValidator(response.data.first_name);
            setLastName(response.data.last_name);
        }).finally(() => {
            setLoading(false);
        });
    }

    const fetchPlace = async () => {
        setLoading(true);
        setMessages({});

        await axios.get("/core/place/get/" + city + "/" + title + "/"
        ).then((response) => {
            setPlace(response.data);
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

    const reserve = async () => {
        setChecking(true);
        setMessages({});

        let data = {};
        data["first_name"] = firstName;
        data["phone"] = phone;
        data["date_time"] = chosenDateTime;
        data["table_size"] = tableSize;
        if (lastName) data["last_name"] = lastName;
        if (comment) data["comment"] = comment;

        await jwt_axios.post("/reservation/create/" + place.id + "/", 
            data
        ).then((response) => {
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
            setChecking(false);
        });
    }

    // const emailValidator = (value) => {
    //     setEmail(value);
    //     setEmailValid(isEmail(value) || value.length === 0);
    // }

    const firstNameValidator = (value) => {
        setFirstName(value);
        setFirstNameValid(isAlpha(value) && value.length > 0);
    }

    const phoneValidator = (value) => {
        setPhone(value);
        setPhoneValid(isMobilePhone(value, isMobilePhoneLocales, {strictMode: true}) && value.length > 0);
    }

    const dateTimeValidator = (value) => {        
        let chosen = moment.tz(value, place.timezone);
        let year = chosen.get('year');
        let month = chosen.get('month');
        let date = chosen.get('date');

        let today = chosen.isoWeekday() - 1;
        let yesterday = today - 1 === -1 ? 6 : today - 1;
        let today_min = moment.tz(place.opening_hours[today][0], place.timezone).set({"year": year, "month": month, "date": date});
        let today_max = moment.tz(place.opening_hours[today][1], place.timezone).set({"year": year, "month": month, "date": date});
        let yesterday_min = moment.tz(place.opening_hours[yesterday][0], place.timezone).set({"year": year, "month": month, "date": date});
        let yesterday_max = moment.tz(place.opening_hours[yesterday][1], place.timezone).set({"year": year, "month": month, "date": date});
        
        let tip = "Open this day: " + 
            (
                yesterday_min > yesterday_max && yesterday_max.format("HH:mm") !== "00:00"
                ?   "00:00 - " +  yesterday_max.format("HH:mm") + " and "
                :   ""
            ) + 
            today_min.format("HH:mm") + " - " + 
            (
                today_min > today_max
                ?   "24:00"
                :   today_max.format("HH:mm")
            );
        
        setHoursTip(tip);
        setDateTime(value);
        setChosenDateTime(chosen.format());
        setDateTimeValid(
            chosen >= moment.tz(place.timezone) && (
            (yesterday_min >= yesterday_max && chosen < yesterday_max) ||
            (today_min >= today_max && chosen >= today_min) ||
            (chosen >= today_min && chosen < today_max))
        );
    }

    const tableSizeValidator = (value) => {
        setTableSize(value);
        let min = 1;
        let max = 10;
        setTableSizeValid(value >= min && value <= max);
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
                            <div className="auth-error">
                                {messages.non_field_errors}
                            </div>
                        }
                        {messages.statusText &&
                            <div className="auth-error">
                                {messages.statusText}
                            </div>
                        }
                        <div className="reservation-container">
                            {isReserved &&
                                <div className="success-back">
                                    <div className="success">
                                        <div className="success-text">
                                            Reservation confirmed
                                        </div>
                                        <div className="button active-button" onClick={() => history.goBack()}>Ok</div>
                                    </div>
                                </div>
                            }
                            <div className="auth-logo">
                                Foodcard
                            </div>
                            <div className="auth-title">
                                Reservation
                            </div>
                            <div className="place-info">
                                <div className="rrrow">
                                    <div className="title">
                                        {place.title}
                                    </div>
                                    <div className="category">
                                        {place.main_category}
                                    </div>
                                </div>
                                <div className="rrrow">
                                    <div className="address">
                                        {place.address && place.address.country + ", " + place.address.city + ", " + place.address.street} 
                                    </div>
                                    <div className="phone">
                                        {place.phone}
                                    </div>
                                </div>
                            </div>
                            <div className="rrow">
                                <div className="reservation-element el50">
                                    <div className="form-element-title">
                                        First name
                                    </div>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className={isFirstNameValid ? "input-text" : "input-text invalid"}
                                        maxlength="50"
                                        value={firstName}
                                        onChange={(e) => firstNameValidator(e.target.value)}
                                    />
                                </div>
                                <div className="reservation-element el50">
                                    <div className="form-element-title">
                                        Last name
                                    </div>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="input-text"
                                        maxlength="50"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="rrow">
                                {/* <div className="reservation-element el50">
                                    <div className="form-element-title">
                                        Email
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        className={isEmailValid ? "input-text" : "input-text invalid"}
                                        maxlength="70"
                                        value={email}
                                        onChange={(e) => emailValidator(e.target.value)}
                                    />
                                </div> */}
                                <div className="reservation-element el50">
                                    <div className="form-element-title">
                                        Phone
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
                            <div className="rrow">
                                <div className="reservation-element full-width">
                                    <div className="form-element-title">
                                        Comment
                                    </div>
                                    <input
                                        type="text"
                                        name="comment"
                                        className="input-text"
                                        value={comment}
                                        maxlength="300"
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="rrow">
                                <div className="reservation-element el30">
                                    <div className="form-element-title">
                                        Guests
                                    </div>
                                    <input
                                        type="number"
                                        id="guests"
                                        name="number"
                                        className={isTableSizeValid ? "input-text" : "input-text invalid"}
                                        value={tableSize}
                                        min="1"
                                        max="10"
                                        step="1"
                                        onChange={(e) => tableSizeValidator(e.target.value)}
                                    />
                                </div>
                                <div className="reservation-element el70">
                                    <div className="form-element-title">
                                        Date and time 
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
                            </div>
                            <div className="form-buttons">
                                <div className="button" onClick={() => history.goBack()}>Cancel</div>
                                {isPhoneValid && isFirstNameValid && isDateTimeValid ?
                                    <div
                                        tabIndex="0"
                                        className="button active-button"
                                        onClick={() => reserve()}
                                        onKeyDown={(e) => e.key === 'Enter' && reserve()}
                                    >
                                        Reserve
                                    </div>
                                :   <div tabindex="0" className="button inactive">Reserve</div>
                                }
                            </div>
                        </div>
                    </div>
                )
            }
		</div>
	);
}
