import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Spinner from '../components/LoaderSpinner/Spinner';
import jwt_axios from '../services/JWTaxios';

import '../reservation.css';
// import place from '../place.json';

import ArrowDownIcon from '../icons/arrow_down_icon.svg';
import ArrowUpIcon from '../icons/arrow_up_icon.svg';


export default function Reservation() {
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [comment, setComment] = useState("");
    const [number, setNumber] = useState();
    const [isReserved, setReserved] = useState(false);
    const [messages, setMessages] = useState({});


    useEffect(() => {
        fetchData();
	}, []);

    const fetchData = async () => {
        setMessages({});
        setLoading(true);

        try {
            const response = await jwt_axios.get("/authentication/user/get/", { withCredentials: true });
            setEmail(response.data.email);
            setFirstName(response.data.first_name);
            setLastName(response.data.last_name);
        } catch(error) {
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response ||
                error.toString()
            );
        } finally {
            setLoading(false);
        }
    }

	return (
        <div>
            {isLoading ?
                <Spinner />
            :   <div className="reservation-container">
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
                        <div className="rrow">
                            <div className="ttitle">
                                {place.place.title}
                            </div>
                            <div className="ccategory">
                                {place.place.categories[0]}
                            </div>
                        </div>
                        <div className="rrow">
                            <div className="aaddress">
                                {place.place.address.country + ", " + place.place.address.city + ", " + place.place.address.street} 
                            </div>
                            <div className="pphone">
                                {place.place.phone}
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
                                className="input-text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
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
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="rrow">
                        <div className="reservation-element el50">
                            <div className="form-element-title">
                                Email
                            </div>
                            <input
                                type="email"
                                name="email"
                                className="input-text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="reservation-element el50">
                            <div className="form-element-title">
                                Phone
                            </div>
                            <input
                                type="phone"
                                name="phone"
                                className="input-text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="reservation-element">
                        <div className="form-element-title">
                            Comment
                        </div>
                        <input
                            type="text"
                            name="comment"
                            className="input-text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                    <div className="rrow">
                        <div className="reservation-element el03">
                            <div className="form-element-title center">
                                Guests
                            </div>
                            <input
                                type="number"
                                name="number"
                                className="input-text"
                                value={number}
                                min="1"
                                max="20"
                                step="1"
                                onChange={(e) => setNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className="reservation-element el40">
                            <div className="form-element-title center">
                                Date
                            </div>
                            <input
                                type="date"
                                name="date"
                                className="input-text"
                                value={date}
                                min="2020-12-18"
                                max="2021-12-18"
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="reservation-element el03">
                            <div className="form-element-title center">
                                Time
                            </div>
                            <input
                                type="time"
                                name="time"
                                className="input-text"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-buttons">
                        <div className="button active-button" onClick={() => setReserved(!isReserved)}>Reserve</div>
                        <div className="button" onClick={() => history.goBack()}>Cancel</div>
                    </div>
                </div>
            }
		</div>
	);
}
