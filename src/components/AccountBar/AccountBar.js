import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Spinner from '../LoaderSpinner/Spinner';
import axiosApiInstance from '../../services/TokenWrap';

import './accountBar.css';


export default function AccountBar({ setAuthenticated, setAccountBarActive }) {

    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const [id, setID] = useState(null);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [messages, setMessages] = useState("");


    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosApiInstance.get("/authentication/get_user/", { withCredentials: true });
                setID(response.data.id);
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
        };

        fetchData();
	}, []);

    const logout = () => {
        localStorage.removeItem('access');
        setAuthenticated(null);
        setAccountBarActive(false);
    }

    const editProfile = () => {

    }


	return (
        <div>
            {isLoading ?
                <Spinner />
            :   <div className="account-bar">   
                    {id &&
                        <div className={"user-avatar color" + id.toString().slice(-1)}>
                            {firstName.charAt(0).toUpperCase()}
                        </div>
                    }
                    <div className="account-row">{email}</div>
                    <div className="account-row">{firstName}</div>
                    <div className="account-row">{lastName}</div>
                    <div className="account-button-panel">
                        <div className="button" onClick={() => editProfile()}>Edit profile</div>
                        <div className="button" onClick={() => logout()}>Log out</div>
                    </div>
                </div>
            }
		</div>
	);
}
