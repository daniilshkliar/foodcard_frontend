import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Spinner from '../LoaderSpinner/Spinner';
import axiosApiInstance from '../../services/JWTaxios';

import './accountBar.css';

import ArrowDownIcon from '../../icons/arrow_down_icon.svg';
import ArrowUpIcon from '../../icons/arrow_up_icon.svg';


export default function AccountBar() {

    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const [isFavoriteLoading, setFavoriteLoading] = useState(false);
    const [id, setID] = useState(null);
    const [isSuperuser, setSuperuser] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [messages, setMessages] = useState({});
    const [isFavoriteActive, setFavoriteActive] = useState(false);
    // const [isAuthenticated, setAuthenticated] = useState(null);


    useEffect(() => {
        fetchData();
        //fetchFavorites();
	}, []);

    const fetchFavorites = async () => {
        setFavoriteLoading(true);
        const response = await axiosApiInstance.get("/core/favorite/get/all/", { withCredentials: true });
        setFavorites(response.data);
        setFavoriteLoading(false);
    }

    const fetchData = async () => {
        setMessages({});
        setLoading(true);

        try {
            const response = await axiosApiInstance.get("/authentication/user/get/", { withCredentials: true });
            setID(response.data.id);
            setSuperuser(response.data.is_superuser);
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

    const logout = async () => {
        try {
            const response = await axiosApiInstance.post("/authentication/logout/", { withCredentials: true });
            setID(null);
            setSuperuser(false);
            setEmail("");
            setFirstName("");
            setLastName("");
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

    const editProfile = () => {

    }


	return (
        <div>
            {isLoading ?
                <Spinner />
            :   <div>
                    {messages.statusText ?
                        <div className="account-bar">
                            <div className="auth-error">
                                {messages.statusText}
                            </div>
                        </div>
                    :   <div className="account-bar">
                            {id ?
                                    <div>
                                        {id &&
                                            <div className={"user-avatar color" + id.toString().slice(-1)}>
                                                {firstName.charAt(0).toUpperCase()}
                                            </div>
                                        }
                                        <div className="account-row">{email}</div>
                                        <div className="account-row">{firstName}</div>
                                        <div className="account-row">{lastName}</div>
                                        <div className="account-scope">
                                            <div className="account-scope-header clickable" onClick={() => setFavoriteActive(!isFavoriteActive)}>
                                                Favorites
                                                <div className="invert arrow">
                                                    {isFavoriteActive ?
                                                    <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                                                    : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                                                    }
                                                </div>
                                            </div>
                                            {isFavoriteActive &&
                                                <div className="fav-button-panel">
                                                    {isFavoriteLoading ?
                                                        <Spinner small={true} />
                                                    :   (favorites.length > 0 ?
                                                            (favorites.map((elem, index) => (
                                                                <div key={index} className="">
                                                                    <div className="button orange-button" onClick={() => history.push("/place/" + elem.place.address.city + "/" + elem.place.title + "/")}>
                                                                        {elem.place.title}
                                                                    </div>
                                                                </div>
                                                            )))
                                                        :   <div className="tip">
                                                                You have no favorite places
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            }
                                        </div>
                                        {isSuperuser &&
                                            <div className="account-scope">
                                                <div className="button active-button" onClick={() => history.push("/controlpanel/")}>Control panel</div>
                                            </div>
                                        }
                                        <div className="account-scope">
                                            <div className="button" onClick={() => editProfile()}>Edit profile</div>
                                            <div className="button" onClick={() => logout()}>Log out</div>
                                        </div>
                                    </div>
                                :   <div>
                                        <div className="button active-button" onClick={() => history.push("/login/")}>Login</div>
                                        <div className="button active-button" onClick={() => history.push("/signup/")}>Signup</div>
                                    </div>
                            }
                        </div>
                    }
                </div>
            }
		</div>
	);
}
