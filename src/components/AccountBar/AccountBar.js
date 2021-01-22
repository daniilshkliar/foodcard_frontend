import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_axios from '../../services/JWTaxios';

import Spinner from '../LoaderSpinner/Spinner';

import './accountBar.css';

import ArrowDownIcon from '../../icons/arrow_down_icon.svg';
import ArrowUpIcon from '../../icons/arrow_up_icon.svg';


export default function AccountBar() {
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const [isFavoriteLoading, setFavoriteLoading] = useState(false);
    const [id, setID] = useState(null);
    const [isStaff, setStaff] = useState(false);
    const [manager, setManager] = useState([]);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [favorites, setFavorites] = useState({"places": []});
    const [messages, setMessages] = useState({});
    const [isFavoriteActive, setFavoriteActive] = useState(false);

    useEffect(() => {
        fetchUser();
	}, []);

    const fetchUser = async () => {
        setLoading(true);
        setMessages({});

        await jwt_axios.get("/authentication/user/get/", {
            withCredentials: true
        }).then((response) => {
            setID(response.data.id);
            setStaff(response.data.is_staff);
            setEmail(response.data.email);
            setFirstName(response.data.first_name);
            setLastName(response.data.last_name);
            setManager(response.data.manager_of);
            fetchFavorites();
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

    const fetchFavorites = async () => {
        setFavoriteLoading(true);
        setMessages({});

        await jwt_axios.get("/core/favorite/get/", {
            withCredentials: true
        }).then((response) => {
            setFavorites(response.data);
        }).catch((error) => {
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response ||
                error.toString()
            );
        }).finally(() => {
            setFavoriteLoading(false);
        });
    }

    const logout = async () => {
        setMessages({});

        await jwt_axios.post("/authentication/logout/", {
            withCredentials: true
        }).then((response) => {
            setID(null);
            setStaff(false);
            setManager([]);
            setEmail("");
            setFirstName("");
            setLastName("");
        }).catch((error) => {
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response ||
                error.toString()
            );
        });
    }

    const editProfile = () => {

    }

	return (
        <div>
            {isLoading ?
                <Spinner />
            :   <div className="account-bar">
                    <div className="account-bar">
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
                                            :   (favorites.places.length > 0 ?
                                                    (favorites.places.map((elem, index) => (
                                                        <div key={index} className="">
                                                            <div className="button orange-button" onClick={() => history.push("/place/" + elem.address.city + "/" + elem.title + "/")}>
                                                                {elem.title}
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
                                {(isStaff || manager.length > 0) &&
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
                </div>
            }
		</div>
	);
}
