import React, { useState } from 'react';
import jwt_axios from '../../services/JWTaxios';

import Spinner from '../LoaderSpinner/Spinner';


export default function EditConfiguration({ 
    place,
    setPlace
}) {
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [newTables, setNewTables] = useState(place.configuration.tables);
    const [popup, setPopup] = useState(false);

    const setConfiguration = async () => {
        setLoading(true);
        setMessages({});

        await jwt_axios.post("/core/place/update/" + place.id + "/", {
            "configuration": {
                "tables": newTables
            }
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

	return (
		<div>
            {isLoading ?
                <div className="margin-top">
                    <Spinner small={true} />
                </div>
            :   <div>
                    {popup &&
                        <div className="popup">
                            Configuration changed successfully
                        </div>
                    }
                    {messages.status &&
                        <div className="auth-error">
                            {messages.statusText}
                        </div>
                    }
                    <div className="edit-scope">
                        <div className="edit-form-title">
                            Enter new configuration
                        </div>
                        <div class="border-top">
                            <div class="schedule-scope">
                                {newTables && newTables.map((elem, index) => (
                                    <div key={index} className="row">
                                        <div className="schedule-weekday">
                                            Number of {index + 1}-seat tables:
                                        </div>
                                        <input
                                            type="number"
                                            name={"table" + index + 1}
                                            min="0"
                                            value={elem}
                                            onChange={(e) => {
                                                let list = [...newTables];
                                                list[index] = parseInt(e.target.value);
                                                setNewTables([...list]);
                                            }}
                                        ></input>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="row">
                            {newTables && !newTables.includes(NaN) ?
                                <div
                                    tabindex="0"
                                    className="save"
                                    onClick={() => setConfiguration()}
                                    onKeyDown={(e) => e.key === 'Enter' && setConfiguration()}
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
