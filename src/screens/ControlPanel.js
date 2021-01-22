import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_axios from '../services/JWTaxios';

import Header from '../components/Header/Header';
import Spinner from '../components/LoaderSpinner/Spinner';
import EditTitle from '../components/EditForms/EditTitle';

import '../editForms.css';
import '../panel.css';


export default function ControlPanel({  }) {
    const history = useHistory();
    const [messages, setMessages] = useState({});
    const [scopeMessages, setScopeMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [isScopeLoading, setScopeLoading] = useState(false);

    const [place, setPlace] = useState({});
    const [places, setPlaces] = useState([]);
    const [activePlace, setActivePlace] = useState("");
    const [activeOption, setActiveOption] = useState("");
    const [editPlaceOption, setEditPlaceOption] = useState("");

    const [editTitle, setEditTitle] = useState(false);
    
    useEffect(() => {
        fetchPlaces();
    }, []);

    const fetchPlaces = async () => {
        setLoading(true);
        setMessages({});

        await jwt_axios.get("/core/panel/get/all/", {
            withCredentials: true 
        }).then((response) => {
            setPlaces(response.data);
        }).catch((error) => {
            if (error.response.status === 400) {
                history.goBack();
            }
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

    const fetchPlace = async () => {
        setScopeLoading(true);
        setScopeMessages({});

        await jwt_axios.get("/core/panel/get/" + activePlace + "/", {
            withCredentials: true 
        }).then((response) => {
            setPlace(response.data);
        }).catch((error) => {
            setScopeMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response ||
                error.toString()
            );
        }).finally(() => {
            setScopeLoading(false);
        });
    }
    
    const clearUseState = (except) => {
        setEditTitle(except === "Edit title");
    }

	return (
        <div className="app">
            <Header isClickable={true} />
            {isLoading ? 
                <Spinner fixed={true} />
            :   <div>
                    {messages.status ? 
                        <div className="panel-error">
                            {messages.status &&
                                <div className="auth-error">
                                    {messages.statusText}
                                </div>
                            }
                        </div>
                    :   <div className="panel">
                            <div className="panel-scope-1">
                                {places.length > 0 && places.map((elem, index) => (
                                    <div
                                        key={index}
                                        className={activePlace === elem.id ? "panel-row selected" : "panel-row"}
                                        onClick={() => {
                                            setActivePlace(elem.id);
                                            setActiveOption("");
                                            clearUseState(null);
                                        }}
                                    >
                                        <div className="id">
                                            {elem.id}
                                        </div>
                                        <div>
                                            Title: {elem.title}
                                        </div>
                                        <div className="address">
                                            Address: {elem.address.country + ", " + elem.address.city + ", " + elem.address.street}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="panel-scope-2">
                                {activePlace &&
                                    <div>
                                        <div
                                            className={activeOption === "Edit place" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                fetchPlace();
                                                setActiveOption("Edit place");
                                                clearUseState(null);
                                            }}
                                        >
                                            Edit place
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="panel-scope-3">
                                {activePlace && activeOption &&
                                    <div>
                                        <div
                                            className={editPlaceOption === "Edit title" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                setEditPlaceOption("Edit title");
                                                clearUseState("Edit title");
                                            }}
                                        >
                                            Edit title
                                        </div>
                                        <div
                                            className={editPlaceOption === "Edit description" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                setEditPlaceOption("Edit description");
                                                clearUseState("Edit description");
                                            }}
                                        >
                                            Edit description
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="panel-scope-4">
                                {isScopeLoading ?
                                    <div className="margin-top">
                                        <Spinner small={true} />
                                    </div>
                                :   <div>
                                        {scopeMessages.status ?
                                            <div className="panel-error">
                                                {scopeMessages.status &&
                                                    <div className="auth-error">
                                                        {scopeMessages.statusText}
                                                    </div>
                                                }
                                            </div>
                                        :   <div>
                                                {editTitle && 
                                                    <EditTitle
                                                        place={place}
                                                        setPlace={setPlace}
                                                        places={places}
                                                        setPlaces={setPlaces}
                                                    />
                                                }
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>
            }
		</div>
	);
}
