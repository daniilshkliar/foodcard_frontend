import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { isEmail, isAlpha, isMobilePhone } from 'validator';
import jwt_axios from '../services/JWTaxios';

import Spinner from '../components/LoaderSpinner/Spinner';


export default function Signup() {
    const history = useHistory();
    const [phone, setPhone] = useState("");
    const [isPhoneValid, setPhoneValid] = useState(false);
    const [email, setEmail] = useState("");
    const [isEmailValid, setEmailValid] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [isFirstNameValid, setFirstNameValid] = useState(false);
    const [lastName, setLastName] = useState("");
    const [isLastNameValid, setLastNameValid] = useState(false);
    const [password1, setPassword1] = useState("");
    const [isPassword1Valid, setPassword1Valid] = useState(false);
    const [password2, setPassword2] = useState("");
    const [isPassword2Valid, setPassword2Valid] = useState(false);
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [isChecking, setChecking] = useState(true);
    const [confirmation, setConfirmation] = useState(false);
    
    useEffect(() => {
        isAuthenticated();
    }, []);

    const isAuthenticated = async () => {
        await jwt_axios.get("/accounts/user/", { 
            withCredentials: true
        }).then(() => {
            history.push("/");
        }).finally(() => {
            setChecking(false);
        });
    }

    const signup = async () => {
        setLoading(true);
        setMessages({});
        
        await axios.post("/accounts/signup/", {
            phone: phone,
            email: email,
            first_name: firstName,
            last_name: lastName,
            password1: password1,
            password2: password2
        }).then(() => {
            setConfirmation(true);
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

    const phoneValidator = (value) => {
        setPhone(value);
        setPhoneValid(isMobilePhone(value));
    }

    const emailValidator = (value) => {
        setEmail(value);
        setEmailValid(isEmail(value));
    }

    const password1Validator = (value) => {
        setPassword1(value);
        setPassword1Valid(value.length > 5);
    }

    const password2Validator = (value) => {
        setPassword2(value);
        setPassword2Valid(value.length > 5 && value===password1);
    }

    const firstNameValidator = (value) => {
        setFirstName(value);
        setFirstNameValid(isAlpha(value) && value.length > 0);
    }

    const lastNameValidator = (value) => {
        setLastName(value);
        setLastNameValid(isAlpha(value) && value.length > 0);
    }
    
    return (
        <div>
            {isChecking ? 
                <Spinner />
            :   <div className="auth">
                    {isLoading && <Spinner />}
                    {messages.non_field_errors &&
                        <div className="auth-error">
                            {messages.non_field_errors[0]}
                        </div>
                    }
                    {messages.status===500 &&
                        <div className="auth-error">
                            {messages.statusText}
                        </div>
                    }
                    {messages.data && messages.data.email &&
                        <div className="auth-error">
                            {messages.data.email[0].charAt(0).toUpperCase() + messages.data.email[0].slice(1)}
                        </div>
                    }
                    {messages.data && messages.data.phone &&
                        <div className="auth-error">
                            {messages.data.phone[0].charAt(0).toUpperCase() + messages.data.phone[0].slice(1)}
                        </div>
                    }
                    <div className="signup-container">
                        <div className="auth-logo">
                            Foodcard
                        </div>
                        <div className="auth-title">
                            Регистрация
                        </div>
                        {confirmation ? 
                            <div>
                                <div className="confirmation">
                                    На вашу почту было отправлено письмо с подтверждением регистрации.
                                </div>
                                <div 
                                    tabindex="0"
                                    className="button center-align"
                                    onClick={() => history.push("/")}
                                    onKeyDown={(e) => e.key === 'Enter' && history.push("/")}
                                >
                                    Понятно
                                </div>
                            </div>
                        :   <div>
                                <div className="form-row">
                                    <div className="signup-element full-width">
                                        <div className="form-element-title">
                                            Телефон
                                        </div>
                                        <input
                                            type="phone"
                                            name="phone"
                                            className={isPhoneValid || phone.length===0 ? "input-text" : "input-text invalid"}
                                            value={phone}
                                            onChange={(e) => phoneValidator(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="signup-element full-width">
                                        <div className="form-element-title">
                                            Почта
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            className={isEmailValid || email.length===0 ? "input-text" : "input-text invalid"}
                                            value={email}
                                            onChange={(e) => emailValidator(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="signup-element">
                                        <div className="form-element-title">
                                            Имя
                                        </div>
                                        <input
                                            type="text"
                                            name="firstName"
                                            className={isFirstNameValid || firstName.length===0 ? "input-text" : "input-text invalid"}
                                            value={firstName}
                                            onChange={(e) => firstNameValidator(e.target.value)}
                                        />
                                    </div>
                                    <div className="signup-element">
                                        <div className="form-element-title">
                                            Фамилия
                                        </div>
                                        <input
                                            type="text"
                                            name="lastName"
                                            className={isLastNameValid || lastName.length===0 ? "input-text" : "input-text invalid"}
                                            value={lastName}
                                            onChange={(e) => lastNameValidator(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="signup-element">
                                        <div className="form-element-title">
                                            Пароль
                                        </div>
                                        <input
                                            type="password"
                                            name="password1"
                                            className={isPassword1Valid || password1.length===0 ? "input-text" : "input-text invalid"}
                                            value={password1}
                                            onChange={(e) => password1Validator(e.target.value)}
                                        />
                                    </div>
                                    <div className="signup-element">
                                        <div className="form-element-title">
                                            Подтвердите пароль
                                        </div>
                                        <input
                                            type="password"
                                            name="password2"
                                            className={isPassword2Valid || password2.length===0 ? "input-text" : "input-text invalid"}
                                            value={password2}
                                            onChange={(e) => password2Validator(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-buttons">
                                    {isPhoneValid && isEmailValid && isPassword1Valid && isPassword2Valid && isFirstNameValid && isLastNameValid ?
                                        <div
                                            tabindex="0"
                                            className="button active-button"
                                            onClick={() => signup()}
                                            onKeyDown={(e) => e.key === 'Enter' && signup()}
                                        >
                                            Зарегистрироваться
                                        </div>
                                    :   <div tabindex="0" className="button inactive">Зарегистрироваться</div>
                                    }
                                    <div
                                        tabindex="0"
                                        className="button"
                                        onClick={() => history.push("/login/")}
                                        onKeyDown={(e) => e.key === 'Enter' && history.push("/login/")}
                                    >
                                        Войти
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}