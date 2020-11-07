import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { isEmail, isAlpha } from 'validator';
import Spinner from '../components/LoaderSpinner/Spinner';
// import AuthService from "../services/auth.service";


export default function Signup() {

    const history = useHistory();
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
    const [message, setMessage] = useState("");
    const [isLoading, setLoading] = useState(false);


    const handleSignup = async () => {
        setLoading(true);
        setMessage("");
    
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/signup/", {
                    username: email,
                    password: password
                }
            );
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
            console.error(error.response.status);
        } finally {
            setLoading(false);
        }
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
        <div className="auth">
            {isLoading && <Spinner />}
            {message !== "" &&
                <div className="auth-error">
                    {message}
                </div>
            }
            <div className="signup-container">
                <div className="auth-title">
                    Sign up
                </div>
                <div className="form-row">
                    <div className="signup-element full-width">
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
                </div>
                <div className="form-row">
                    <div className="signup-element">
                        <div className="form-element-title">
                            First name
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
                            Last name
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
                            Password
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
                            Confirm password
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
                    <div className="button" onClick={() => history.push("/login/")}>Login</div>
                    {isEmailValid && isPassword1Valid && isPassword2Valid && isFirstNameValid && isLastNameValid ?
                        <div className="button active-button" onClick={() => handleSignup()}>Sign up</div>
                    :   <div className="button inactive">Sign up</div>
                    }
                </div>
            </div>
        </div>
    )
}