import React, { useState } from 'react';
import moment from 'moment-timezone';
import jwt_axios from '../../services/JWTaxios';

import Spinner from '../LoaderSpinner/Spinner';


export default function EditSchedule({ 
    place,
    setPlace
}) {
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [popup, setPopup] = useState(false);
    const [openingHours, setOpeningHours] = useState(place.opening_hours.length === 7 ? place.opening_hours : [
        [,],
        [,],
        [,],
        [,],
        [,],
        [,],
        [,]
    ]);

    const setSchedule = async () => {
        setLoading(true);
        setMessages({});

        await jwt_axios.post("/core/place/update/" + place.id + "/", {
            "opening_hours": openingHours
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

    const appendTime = (index, day, time) => {
        let schedule = [...openingHours];
        schedule[day][index] = moment.tz(place.timezone).second(0).format().replace(/\d{2}:\d{2}/, time);
        setOpeningHours(schedule);
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
                            Opening hours changed successfully
                        </div>
                    }
                    {messages.status &&
                        <div className="auth-error">
                            {messages.statusText}
                        </div>
                    }
                    <div className="edit-scope">
                        <div className="edit-form-title">
                            Choose opening hours
                        </div>
                        <div className="border-top">
                            <div className="schedule-scope">
                                {openingHours && openingHours.map((day, index) => (
                                    <div key={index} className="row">
                                        <div className="schedule-weekday">
                                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index]}
                                        </div>
                                        <div className="orange-dot"></div>
                                        <input
                                            type="time"
                                            name="weekday"
                                            step="900"
                                            value={openingHours[index][0] && moment.tz(openingHours[index][0], place.timezone).format("HH:mm")}
                                            onChange={(e) => appendTime(0, index, e.target.value)}
                                        />
                                        -
                                        <input
                                            type="time"
                                            name="weekday"
                                            step="900"
                                            value={openingHours[index][1] && moment.tz(openingHours[index][1], place.timezone).format("HH:mm")}
                                            onChange={(e) => appendTime(1, index, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="row">
                            {openingHours && openingHours.length === 7 ?
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
                </div>
            }
		</div>
	);
}