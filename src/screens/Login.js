import React, { useState } from 'react';
import axios from "axios";
import { useHistory } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import Spinner from '../components/LoaderSpinner/Spinner';


export default function Login() {

    const history = useHistory();
    const [email, setEmail] = useState("");
    const [isEmailValid, setEmailValid] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordValid, setPasswordValid] = useState(false);
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);


    const handleLogin = async () => {
        setLoading(true);
        setMessages({});

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/token/", {
                    username: email,
                    password: password
                }
            );
    
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);

            history.push("/");
        } catch(error) {
            setMessages(
                (error.response && error.response.data) ||
                error.message ||
                error.toString());
        } finally {
            setLoading(false);
        }
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
        <div className="auth">
            {isLoading && <Spinner />}
            {messages.detail &&
                <div className="auth-error">
                    {messages.detail}
                </div>
            }
            <div className="login-container">
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
                    <div className="button" onClick={() => history.push("/signup/")}>Sign up</div>
                    {isEmailValid && isPasswordValid ?
                        <div className="button active-button" onClick={() => handleLogin()}>Login</div>
                    :   <div className="button inactive">Login</div>
                    }
                </div>
            </div>
        </div>
    )
}