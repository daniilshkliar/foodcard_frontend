import React, { useState } from 'react';
import jwt_axios from '../../services/JWTaxios';

import Spinner from '../LoaderSpinner/Spinner';


export default function EditSchedule({ 
    place,
    setPlace
}) {
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [popup, setPopup] = useState(false);
    const [operationHours, setOperationHours] = useState(place.operation_hours.length === 7 ? place.operation_hours : [
        [,],
        [,],
        [,],
        [,],
        [,],
        [,],
        [,]
    ]);
    let date = new Date().toISOString().split('T')[0] + 'T';

    const setSchedule = async () => {
        setLoading(true);
        setMessages({});

        await jwt_axios.post("/core/place/update/" + place.id + "/", {
            "operation_hours": operationHours
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

    const appendTime = (day, index, time) => {
        let schedule = [...operationHours];
        schedule[index][day] = date + time;
        setOperationHours(schedule);
    }

	return (
		<div>
            {isLoading ?
                <div className="margin-top">
                    <Spinner small={true} />
                </div>
            :   <div>
                    <div className="edit-scope">
                        <div className="edit-form-title">
                            Choose hours of operation
                        </div>
                        <div className="border-top">
                            <div className="schedule-scope">
                                {operationHours && operationHours.map((day, index) => (
                                    <div key={index} className="row">
                                        <div className="schedule-weekday">
                                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index]}
                                        </div>
                                        <div className="orange-dot"></div>
                                        <input
                                            type="time"
                                            name="weekday"
                                            step="900"
                                            value={operationHours[index][0] && operationHours[index][0].split('T')[1].slice(0,5)}
                                            onChange={(e) => appendTime(0, index, e.target.value)}
                                        />
                                        -
                                        <input
                                            type="time"
                                            name="weekday"
                                            step="900"
                                            value={operationHours[index][1] && operationHours[index][1].split('T')[1].slice(0,5)}
                                            onChange={(e) => appendTime(1, index, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="row">
                            {operationHours && !operationHours.find(list => list[0]===date || list[1]===date) && operationHours.length === 7 ?
                                <div
                                    tabindex="0"
                                    className="save"
                                    onClick={() => setSchedule()}
                                    onKeyDown={(e) => e.key === 'Enter' && setSchedule()}
                                >
                                    Save
                                </div>
                            :   <div tabindex="0" className="button inactive">Save</div>
                            }
                        </div>
                    </div>
                    {popup &&
                        <div className="popup">
                            Operation hours changed successfully
                        </div>
                    }
                    <div className="panel-error">
                        {messages.status &&
                            <div className="auth-error">
                                {messages.statusText}
                            </div>
                        }
                    </div>
                </div>
            }
		</div>
	);
}