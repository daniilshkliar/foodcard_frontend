import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import isEmail from 'validator/lib/isEmail';
import jwt_axios from '../services/JWTaxios';

import Spinner from '../components/LoaderSpinner/Spinner';


export default function Login() {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [isEmailValid, setEmailValid] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordValid, setPasswordValid] = useState(false);
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [isChecking, setChecking] = useState(true);

    useEffect(() => {
        isAuthenticated();
    }, []);

    const isAuthenticated = async () => {
        await jwt_axios.get("/authentication/user/check/login/", { 
            withCredentials: true
        }).then(() => {
            history.push("/");
        }).finally(() => {
            setChecking(false);
        });
    }

    const handleLogin = async () => {
        setLoading(true);
        setMessages({});

        await axios.post("/authentication/login/", {
            email: email,
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

    const emailValidator = (value) => {
        setEmail(value);
        setEmailValid(isEmail(value));
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
                    <div className="login-container">
                        <div className="auth-logo">
                            Foodcard
                        </div>
                        <div className="auth-title">
                            Login
                        </div>
                        <div className="login-element">
                            <div className="form-element-title">
                                Email
                            </div>
                            <input
                                type="email"
                                name="email"
                                className={isEmailValid || email.length===0 ? "input-text" : "input-text invalid"}
                                value={email}
                                onChange={(e) => emailValidator(e.target.value)}
                            />
                        </div>
                        <div className="login-element">
                            <div className="form-element-title">
                                Password
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
                            <div
                                tabindex="0"
                                className="button"
                                onClick={() => history.push("/signup/")}
                                onKeyDown={(e) => e.key === 'Enter' && history.push("/signup/")}
                            >
                                Sign up
                            </div>
                            {isEmailValid && isPasswordValid ?
                                <div
                                    tabindex="0"
                                    className="button active-button"
                                    onClick={() => handleLogin()}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                >
                                    Login
                                </div>
                            :   <div tabindex="0" className="button inactive">Login</div>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}