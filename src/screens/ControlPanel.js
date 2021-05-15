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
import Reservations from '../components/Reservations/Reservations';
import StaffManager from '../components/StaffManager/StaffManager';
import EditMenu from '../components/EditForms/EditMenu';
import Reservation from './Reservation';

import '../editForms.css';
import '../panel.css';

import CloseIcon from '../icons/close_icon.svg';

import dict from '../dict.json';


export default function ControlPanel({  }) {
    const history = useHistory();
    const redirectedFromReservation = history.location.state &&
        history.location.state.from.split('-')[0] === 'Reservation' &&
        history.location.state.from.split('-')[1];
    const [messages, setMessages] = useState({});
    const [scopeMessages, setScopeMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [isScopeLoading, setScopeLoading] = useState(false);
    const [isDeleting, setDeleting] = useState(false);

    const [place, setPlace] = useState({});
    const [places, setPlaces] = useState([]);
    const [perms, setPerms] = useState([]);
    const [activePlace, setActivePlace] = useState("");
    const [activeOption, setActiveOption] = useState("");
    const [editPlaceOption, setEditPlaceOption] = useState("");
    const [panelScope, setPanelScope] = useState("");

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

        await jwt_axios.post("/core/panel/places/", {
            withCredentials: true 
        }).then((response) => {
            setPlaces([...places, ...response.data.results]);
            if (redirectedFromReservation && response.data.results.filter(elem => elem.id === parseInt(redirectedFromReservation)).length===1) {
                setActivePlace(parseInt(redirectedFromReservation));
                fetchPerms(parseInt(redirectedFromReservation));
            }
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
    
    const fetchPerms = async (id) => {
        await jwt_axios.get("/accounts/user/permissions/" + id + "/", {
            withCredentials: true
        }).then((response) => {
            setPerms(response.data.permissions);
            if (redirectedFromReservation && response.data.permissions.includes('view_place')) {
                setActiveOption("Manage reservations");
                setPanelScope('3-4');
                fetchPlace(parseInt(redirectedFromReservation));
            }
        });
    }

    const fetchPlace = async (place_id) => {
        setScopeLoading(true);
        setScopeMessages({});

        await jwt_axios.post("/core/panel/places/get/" + place_id + "/", {
            withCredentials: true 
        }).then((response) => {
            setPlace(response.data);
            if (history.location.state) history.replace('/controlpanel');
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
    
    const handleDelete = async () => {
        setDeleting(true);

        await jwt_axios.post("/core/places/delete/" + place.id + "/", {
            withCredentials: true 
        }).then((response) => {
            setPlaces(places.filter(elem => elem.id !== place.id));
            setPlace({});
            setPerms([]);
            setActivePlace("");
            setActiveOption("");
            setEditPlaceOption("");
            setPanelScope("");
        }).finally(() => {
            setDeleting(false);
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
                            {editPlaceOption === "delete" &&
                                <div className="reservation-delete-background">
                                    <div className="reservation-delete-window">
                                        <div
                                            className="filter-close"
                                            onClick={() => setEditPlaceOption("")}
                                        >
                                            <img src={CloseIcon} alt="Close icon" draggable="false" />
                                        </div>
                                        {isDeleting ?
                                            <Spinner small={true} />
                                        :   <div className="delete-info">
                                                Вы действительно хотите удалить {dict.categories_src_dict[place.main_category.name].toLowerCase()} {place.title}?
                                                <div className="confirm-buttons">
                                                    <div tabIndex="0" className="button cancel-button" onClick={() => handleDelete()}>Да</div>
                                                    <div tabIndex="0" className="button" onClick={() => setEditPlaceOption("")}>
                                                        Нет
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                            <div className="panel-scope-1">
                                {places.length > 0 && places.map((elem, index) => (
                                    <div
                                        key={index}
                                        className={activePlace === elem.id ? "panel-row selected" : "panel-row"}
                                        onClick={() => {
                                            fetchPerms(elem.id);
                                            setActivePlace(elem.id);
                                            setActiveOption("");
                                            clearUseState(null);
                                        }}
                                    >
                                        <div className="activity">
                                            <div>{elem.is_active ? "Активно" : "Неактивно"}</div>
                                            <div className={elem.is_active ? "indicator is_active" : "indicator is_inactive"}></div>
                                        </div>
                                        <div>
                                            Название: {elem.title}
                                        </div>
                                        <div className="address">
                                            Адрес: {dict.countries_src_dict[elem.country.name] + ", " + dict.cities_src_dict[elem.city] + ", " + elem.street}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="panel-scope-2">
                                {activePlace && perms.includes('change_place') &&
                                    <div>
                                        <div
                                            className={activeOption === "Edit place" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                fetchPlace(activePlace);
                                                setActiveOption("Edit place");
                                                setEditPlaceOption("");
                                                setPanelScope('4');
                                                clearUseState(null);
                                            }}
                                        >
                                            Редактировать заведение
                                        </div>
                                    </div>
                                }
                                {activePlace && perms.includes('change_place') &&
                                    <div>
                                        <div
                                            className={activeOption === "Edit menu" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                fetchPlace(activePlace);
                                                setActiveOption("Edit menu");
                                                setPanelScope('6');
                                                clearUseState(null);
                                            }}
                                        >
                                            Редактировать меню
                                        </div>
                                    </div>
                                }
                                {activePlace && perms.includes('view_place') &&
                                    <div>
                                        <div
                                            className={activeOption === "Manage reservations" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                fetchPlace(activePlace);
                                                setActiveOption("Manage reservations");
                                                setPanelScope('3-4');
                                                clearUseState(null);
                                            }}
                                        >
                                            Управление резервациями
                                        </div>
                                    </div>
                                }
                                {activePlace && perms.includes('manage_place') &&
                                    <div>
                                        <div
                                            className={activeOption === "Manage staff" ? "panel-row selected" : "panel-row"}
                                            onClick={() => {
                                                fetchPlace(activePlace);
                                                setActiveOption("Manage staff");
                                                setPanelScope('5');
                                                clearUseState(null);
                                            }}
                                        >
                                            Управление персоналом
                                        </div>
                                    </div>
                                }
                            </div>
                            {panelScope === '4' &&
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
                                                Название
                                            </div>
                                            <div
                                                className={editPlaceOption === "description" ? "panel-row selected" : "panel-row"}
                                                onClick={() => {
                                                    setEditPlaceOption("description");
                                                    clearUseState("description");
                                                }}
                                            >
                                                Описание
                                            </div>
                                            <div
                                                className={editPlaceOption === "contacts" ? "panel-row selected" : "panel-row"}
                                                onClick={() => {
                                                    setEditPlaceOption("contacts");
                                                    clearUseState("contacts");
                                                }}
                                            >
                                                Контакты
                                            </div>
                                            <div
                                                className={editPlaceOption === "schedule" ? "panel-row selected" : "panel-row"}
                                                onClick={() => {
                                                    setEditPlaceOption("schedule");
                                                    clearUseState("schedule");
                                                }}
                                            >
                                                График работы
                                            </div>
                                            <div
                                                className={editPlaceOption === "photos" ? "panel-row selected" : "panel-row"}
                                                onClick={() => {
                                                    setEditPlaceOption("photos");
                                                    clearUseState("photos");
                                                }}
                                            >
                                                Фотографии
                                            </div>
                                            <div
                                                className={editPlaceOption === "conf" ? "panel-row selected" : "panel-row"}
                                                onClick={() => {
                                                    setEditPlaceOption("conf");
                                                    clearUseState("conf");
                                                }}
                                            >
                                                Конфигурация
                                            </div>
                                            <div
                                                className={editPlaceOption === "categories" ? "panel-row selected" : "panel-row"}
                                                onClick={() => {
                                                    setEditPlaceOption("categories");
                                                    clearUseState("categories");
                                                }}
                                            >
                                                Категории
                                            </div>
                                            <div
                                                className={editPlaceOption === "cuisines" ? "panel-row selected" : "panel-row"}
                                                onClick={() => {
                                                    setEditPlaceOption("cuisines");
                                                    clearUseState("cuisines");
                                                }}
                                            >
                                                Кухни
                                            </div>
                                            <div
                                                className={editPlaceOption === "additional" ? "panel-row selected" : "panel-row"}
                                                onClick={() => {
                                                    setEditPlaceOption("additional");
                                                    clearUseState("additional");
                                                }}
                                            >
                                                Дополнительные услуги
                                            </div>
                                            {activePlace && perms.includes('delete_place') &&
                                                <div
                                                    className={editPlaceOption === "delete" ? "panel-row selected" : "panel-row"}
                                                    onClick={() => {
                                                        setEditPlaceOption("delete");
                                                        clearUseState("");
                                                    }}
                                                >
                                                    Удалить заведение
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            }
                            {panelScope === '4' && 
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
                            }
                            {panelScope === '3-4' &&
                                <div className="panel-scope-3-4">
                                    <Reservations place={place} setPlace={setPlace} redirectedFromReservation={parseInt(redirectedFromReservation)} />
                                </div>
                            }
                            {panelScope === '5' &&
                                <div className="panel-scope-3-4">
                                    <StaffManager id={activePlace} setPlace={setPlace} />
                                </div>
                            }
                            {panelScope === '6' &&
                                <div className="panel-scope-3-4">
                                    <EditMenu place_id={activePlace} setPlace={setPlace} />
                                </div>
                            }
                        </div>
                    }
                </div>
            }
		</div>
	);
}
