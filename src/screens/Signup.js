import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
// import AuthService from "../services/auth.service";


export default function Signup() {

    const history = useHistory();
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setLoading] = useState(false);


    const handleSignup = async () => {
        // setLoading(true);
        // setMessage("");
    
        // try {
        //     const response = await axios.post(
        //     "http://127.0.0.1:8000/login/",
        //     {
        //             username: username,
        //             password: password
        //         }
        //     );
            
        //     localStorage.setItem('token', response.data.token);
        //     localStorage.setItem('user', JSON.stringify(response.data.user));
        // } catch (error) {
        //     console.error(error.response.status);
        // } finally {
        //     setLoading(false);
        // }
    }


    return (
        <div className="auth">
            <div className="signup-container">
                <div className="auth-title">
                    Sign up
                </div>
                <div className="form-row">
                    <div className="form-column">
                        <div className="signup-element">
                            <div className="form-element-title">
                                Email
                            </div>
                            <input
                                type="email"
                                name="email"
                                className="input-text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="signup-element">
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
                        <div className="signup-element">
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
                    <div className="form-column">
                        <div className="signup-element">
                            <div className="form-element-title">
                                Password
                            </div>
                            <input
                                type="password"
                                name="password1"
                                className="input-text"
                                value={password1}
                                onChange={(e) => setPassword1(e.target.value)}
                            />
                        </div>
                        <div className="signup-element">
                            <div className="form-element-title">
                                Confirm password
                            </div>
                            <input
                                type="password"
                                name="password2"
                                className="input-text"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-buttons">
                    <div className="button" onClick={() => history.push("/login/")}>Login</div>
                    <div className="button active-button" onClick={() => handleSignup()}>Sign up</div>
                </div>
            </div>
        </div>
    )
}

// const required = value => {
//   if (!value) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         This field is required!
//       </div>
//     );
//   }
// };

// const email = value => {
//   if (!isEmail(value)) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         This is not a valid email.
//       </div>
//     );
//   }
// };

// const vusername = value => {
//   if (value.length < 3 || value.length > 20) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         The username must be between 3 and 20 characters.
//       </div>
//     );
//   }
// };

// const vpassword = value => {
//   if (value.length < 6 || value.length > 40) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         The password must be between 6 and 40 characters.
//       </div>
//     );
//   }
// };