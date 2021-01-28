import React, { useState } from 'react';
import jwt_axios from '../../services/JWTaxios';

import Spinner from '../LoaderSpinner/Spinner';

import ArrowDownIcon from '../../icons/arrow_down_icon.svg';
import ArrowUpIcon from '../../icons/arrow_up_icon.svg';

import dict from '../../dict.json';


export default function EditCuisines({ 
    place,
    setPlace
}) {
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [newCuisines, setNewCuisines] = useState(place.cuisines);
    const [newMainCuisine, setNewMainCuisine] = useState(place.main_cuisine);
    const [popup, setPopup] = useState(false);
    const [isMainCuisineActive, setMainCuisineActive] = useState(false);

    const setCuisines = async () => {
        setLoading(true);
        setMessages({});

        await jwt_axios.post("/core/place/update/" + place.id + "/", {
            "main_cuisine": newMainCuisine,
            "cuisines": newCuisines
        }, {
            withCredentials: true 
        }).then((response) => {
            setPlace(response.data);
            setPopup(true);
        }).catch((error) => {
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response ||
                error.toString()
            );
            setPopup(false);
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleCuisinesChange = (element) => {
        if (newCuisines.includes(element)) {
            setNewCuisines([...newCuisines.filter(elem => elem !== element)]);
            newMainCuisine === element && setNewMainCuisine("");
        } else {
            setNewCuisines([...newCuisines, element]);
        }
    }

	return (
		<div>
            {isLoading ?
                <div className="margin-top">
                    <Spinner small={true} />
                </div>
                :   <div>
                    {popup &&
                        <div className="popup">
                            Cuisines changed successfully
                        </div>
                    }
                    {messages.status &&
                        <div className="auth-error">
                            {messages.statusText}
                        </div>
                    }
                    <div className="edit-scope">
                        <div className="edit-form-title">
                            Choose your cuisines
                        </div>
                        {dict.cuisines_src &&
                            <div className="filter-box editable">
                                <div className="filter-body">
                                    {dict.cuisines_src.map((element, index) => 
                                        <div key={index} className={"button filter-element" + (newCuisines.includes(element) ? " active-button" : "")}
                                            onClick={() => handleCuisinesChange(element)}>
                                            {element}
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                        <div className="filter-box half-width margin-right scrollable margin-top">
                            <div className="filter-header clickable" onClick={() => setMainCuisineActive(!isMainCuisineActive)}>
                                Main cuisine
                                <div className="invert arrow">
                                    {isMainCuisineActive ?
                                    <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                                    : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                                    }
                                </div>
                            </div>
                            <div className={isMainCuisineActive ? "filter-location-expanded" : "filter-location-non-expanded"}>
                                <div
                                    className="button filter-element active-button"
                                    onClick={() => {
                                        setMainCuisineActive(!isMainCuisineActive);
                                    }}
                                >
                                    {newMainCuisine}
                                </div>
                            </div>
                            {isMainCuisineActive &&
                                <div className="filter-body">
                                    {newCuisines.length > 0 ?
                                        newCuisines.filter(element => element !== newMainCuisine).map((element, index) =>
                                            <div 
                                                key={index} 
                                                className="button filter-element"
                                                onClick={() => setNewMainCuisine(element)}
                                            >
                                                {element}
                                            </div>)
                                    :   <div className="tip small-margin-top">
                                            No options
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                        <div className="row">
                            {newCuisines.length > 0 && newMainCuisine ?
                                <div
                                    tabindex="0"
                                    className="save"
                                    onClick={() => setCuisines()}
                                    onKeyDown={(e) => e.key === 'Enter' && setCuisines()}
                                >
                                    Save
                                </div>
                            :   <div tabindex="0" className="button inactive">Save</div>
                            }
                        </div>
                    </div>
                </div>
            }
		</div>
	);
}
