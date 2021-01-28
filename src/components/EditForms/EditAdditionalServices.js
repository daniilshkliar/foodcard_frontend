import React, { useState } from 'react';
import jwt_axios from '../../services/JWTaxios';

import Spinner from '../LoaderSpinner/Spinner';

import dict from '../../dict.json';


export default function EditAdditionalServices({ 
    place,
    setPlace
}) {
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [newAdditionalServices, setNewAdditionalServices] = useState(place.additional_services);
    const [popup, setPopup] = useState(false);

    const setAdditionalServices = async () => {
        setLoading(true);
        setMessages({});

        await jwt_axios.post("/core/place/update/" + place.id + "/", {
            "additional_services": newAdditionalServices
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

    const handleAdditionalServicesChange = (element) => {
        newAdditionalServices.includes(element) ?
            setNewAdditionalServices([...newAdditionalServices.filter(elem => elem !== element)])
        :   setNewAdditionalServices([...newAdditionalServices, element]);                
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
                            Additional services changed successfully
                        </div>
                    }
                    {messages.status &&
                        <div className="auth-error">
                            {messages.statusText}
                        </div>
                    }
                    <div className="edit-scope">
                        <div className="edit-form-title">
                            Choose your additional services
                        </div>
                        {dict.additional_src &&
                            <div className="filter-box editable">
                                <div className="filter-body">
                                    {dict.additional_src.map((element, index) => 
                                        <div key={index} className={"button filter-element" + (newAdditionalServices.includes(element) ? " active-button" : "")}
                                            onClick={() => handleAdditionalServicesChange(element)}>
                                            {element}
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                        <div className="row">
                            {newAdditionalServices.length > 0 ?
                                <div
                                    tabindex="0"
                                    className="save"
                                    onClick={() => setAdditionalServices()}
                                    onKeyDown={(e) => e.key === 'Enter' && setAdditionalServices()}
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
