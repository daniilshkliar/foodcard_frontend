import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import jwt_axios from '../services/JWTaxios';

import Spinner from '../components/LoaderSpinner/Spinner';


export default function Login() {
    const history = useHistory();
    const [identifier, setIdentifier] = useState("");
    const [isIdentifierValid, setIdentifierValid] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordValid, setPasswordValid] = useState(false);
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [isChecking, setChecking] = useState(true);

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

    const login = async () => {
        setLoading(true);
        setMessages({});

        await axios.post("/accounts/login/", {
            identifier: identifier,
            password: password
        }, { 
            withCredentials: true 
        }).then(() => {
            history.push("/");
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

    const identifierValidator = (value) => {
        setIdentifier(value);
        setIdentifierValid(isEmail(value) || isMobilePhone(value));
    }

    const passwordValidator = (value) => {
        setPassword(value);
        setPasswordValid(value.length > 5);
    }

    return (
        <div>
            {isChecking ? 
                <Spinner />
            :   <div className="auth">
                    {isLoading && <Spinner />}
                    {messages.data && messages.data.non_field_errors &&
                        <div className="auth-error">
                            {messages.data.non_field_errors[0]}
                        </div>
                    }
                    {messages.data && messages.data.status===500 &&
                        <div className="auth-error">
                            {messages.data.statusText}
                        </div>
                    }
                    <div className="login-container">
                        <div className="auth-logo">
                            Foodcard
                        </div>
                        <div className="auth-title">
                            Вход в систему
                        </div>
                        <div className="login-element">
                            <div className="form-element-title">
                                Телефон или почта
                            </div>
                            <input
                                type="text"
                                name="identifier"
                                className={isIdentifierValid || identifier.length===0 ? "input-text" : "input-text invalid"}
                                value={identifier}
                                onChange={(e) => identifierValidator(e.target.value)}
                            />
                        </div>
                        <div className="login-element">
                            <div className="form-element-title">
                                Пароль
                            </div>
                            <input
                                type="password"
                                name="password"
                                className={isPasswordValid || password.length===0 ? "input-text" : "input-text invalid"}
                                value={password}
                                onChange={(e) => passwordValidator(e.target.value)}
                            />
                        </div>
                        <div className="form-buttons">
                            {isIdentifierValid && isPasswordValid ?
                                <div
                                    tabindex="0"
                                    className="button active-button"
                                    onClick={() => login()}
                                    onKeyDown={(e) => e.key === 'Enter' && login()}
                                >
                                    Войти
                                </div>
                            :   <div tabindex="0" className="button inactive">Войти</div>
                            }
                            <div
                                tabindex="0"
                                className="button"
                                onClick={() => history.push("/signup/")}
                                onKeyDown={(e) => e.key === 'Enter' && history.push("/signup/")}
                            >
                                Зарегистрироваться
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}