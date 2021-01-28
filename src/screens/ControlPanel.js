import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_axios from '../services/JWTaxios';

import Header from '../components/Header/Header';
import Spinner from '../components/LoaderSpinner/Spinner';
import EditTitle from '../components/EditForms/EditTitle';
import EditDescription from '../components/EditForms/EditDescription';
import EditCategories from '../components/EditForms/EditCategories';
import EditCuisines from '../components/EditForms/EditCuisines';
import EditAdditionalServices from '../components/EditForms/EditAdditionalServices';
import EditContacts from '../components/EditForms/EditContacts';
import EditSchedule from '../components/EditForms/EditSchedule';
import EditPhotos from '../components/EditForms/EditPhotos';
import EditConfiguration from '../components/EditForms/EditConfiguration';

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
    const [editDescription, setEditedDescription] = useState(false);
    const [editCategories, setEditCategories] = useState(false);
    const [editCuisines, setEditCuisines] = useState(false);
    const [editAdditionalServices, setEditAdditionalServices] = useState(false);
    const [editContacts, setEditContacts] = useState(false);
    const [editSchedule, setEditSchedule] = useState(false);
    const [editPhotos, setEditPhotos] = useState(false);
    const [editConfiguration, setEditConfiguration] = useState(false);
    
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
        setEditTitle(except === "title");
        setEditedDescription(except === "description");
        setEditCategories(except === "categories");
        setEditCuisines(except === "cuisines");
        setEditAdditionalServices(except === "additional");
        setEditContacts(except === "contacts");
        setEditSchedule(except === "schedule");
        setEditPhotos(except === "photos");
        setEditConfiguration(except === "conf");
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
                                        {/* <div className="activity">
                                            <label class="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={elem.is_active}
                                                    onChange={(e) => (

                                                    )}
                                                ></input>
                                                <span class="switch-slider round"></span>
                                            </label>
                                        </div> */}
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
                                                setEditPlaceOption("");
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
                                            className={editPlaceOption === "title" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                setEditPlaceOption("title");
                                                clearUseState("title");
                                            }}
                                        >
                                            Edit title
                                        </div>
                                        <div
                                            className={editPlaceOption === "description" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                setEditPlaceOption("description");
                                                clearUseState("description");
                                            }}
                                        >
                                            Edit description
                                        </div>
                                        <div
                                            className={editPlaceOption === "categories" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                setEditPlaceOption("categories");
                                                clearUseState("categories");
                                            }}
                                        >
                                            Edit categories
                                        </div>
                                        <div
                                            className={editPlaceOption === "cuisines" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                setEditPlaceOption("cuisines");
                                                clearUseState("cuisines");
                                            }}
                                        >
                                            Edit cuisines
                                        </div>
                                        <div
                                            className={editPlaceOption === "additional" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                setEditPlaceOption("additional");
                                                clearUseState("additional");
                                            }}
                                        >
                                            Edit additional services
                                        </div>
                                        <div
                                            className={editPlaceOption === "contacts" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                setEditPlaceOption("contacts");
                                                clearUseState("contacts");
                                            }}
                                        >
                                            Edit contacts
                                        </div>
                                        <div
                                            className={editPlaceOption === "schedule" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                setEditPlaceOption("schedule");
                                                clearUseState("schedule");
                                            }}
                                        >
                                            Edit hours of operation
                                        </div>
                                        <div
                                            className={editPlaceOption === "photos" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                setEditPlaceOption("photos");
                                                clearUseState("photos");
                                            }}
                                        >
                                            Edit photos
                                        </div>
                                        <div
                                            className={editPlaceOption === "conf" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                setEditPlaceOption("conf");
                                                clearUseState("conf");
                                            }}
                                        >
                                            Edit configuration
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
                                                {editDescription && 
                                                    <EditDescription
                                                        place={place}
                                                        setPlace={setPlace}
                                                    />
                                                }
                                                {editCategories && 
                                                    <EditCategories
                                                        place={place}
                                                        setPlace={setPlace}
                                                    />
                                                }
                                                {editCuisines && 
                                                    <EditCuisines
                                                        place={place}
                                                        setPlace={setPlace}
                                                    />
                                                }
                                                {editAdditionalServices && 
                                                    <EditAdditionalServices
                                                        place={place}
                                                        setPlace={setPlace}
                                                    />
                                                }
                                                {editContacts && 
                                                    <EditContacts
                                                        place={place}
                                                        setPlace={setPlace}
                                                        places={places}
                                                        setPlaces={setPlaces}
                                                    />
                                                }
                                                {editSchedule && 
                                                    <EditSchedule
                                                        place={place}
                                                        setPlace={setPlace}
                                                    />
                                                }
                                                {editPhotos && 
                                                    <EditPhotos
                                                        place={place}
                                                        setPlace={setPlace}
                                                    />
                                                }
                                                {editConfiguration && 
                                                    <EditConfiguration
                                                        place={place}
                                                        setPlace={setPlace}
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
