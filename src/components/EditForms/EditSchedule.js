import React, { useState } from 'react';
import moment, { utc } from 'moment-timezone';
import jwt_axios from '../../services/JWTaxios';

import Spinner from '../LoaderSpinner/Spinner';


export default function EditSchedule({ 
    place,
    setPlace
}) {
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [popup, setPopup] = useState(false);
    const [openingHours, setOpeningHours] = useState(
        place.opening_hours && place.opening_hours.length === 7 ? 
            place.opening_hours 
        :   [[null,null], [null,null], [null,null], [null,null], [null,null], [null,null], [null,null]]
    );

    const setSchedule = async () => {
        setLoading(true);
        setMessages({});

        await jwt_axios.post("/core/places/update/" + place.id + "/", {
            opening_hours: openingHours
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
        if (time == "") {
            schedule[day][index] = null;
        } else {
            schedule[day][index] = moment.tz(place.timezone).second(0).format().replace(/\d{2}:\d{2}/, time);
        }
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
                            Расписание успешно изменено
                        </div>
                    }
                    {messages.status &&
                        <div className="auth-error">
                            {messages.statusText}
                        </div>
                    }
                    <div className="edit-scope">
                        <div className="edit-form-title">
                            Введите новый график работы
                        </div>
                        <div className="border-top">
                            <div className="schedule-scope">
                                {openingHours && openingHours.map((day, index) => (
                                    <div key={index} className="row">
                                        <div className="schedule-weekday">
                                            {["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"][index]}
                                        </div>
                                        <div className="orange-dot"></div>
                                        <input
                                            type="time"
                                            name="weekday"
                                            step="900"
                                            value={openingHours[index][0] && moment.utc(openingHours[index][0]).tz(place.timezone).format("HH:mm") || ''}
                                            onChange={(e) => appendTime(0, index, e.target.value)}
                                        />
                                        -
                                        <input
                                            type="time"
                                            name="weekday"
                                            step="900"
                                            value={openingHours[index][1] && moment.utc(openingHours[index][1]).tz(place.timezone).format("HH:mm") || ''}
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
                                    Сохранить
                                </div>
                            :   <div tabindex="0" className="button inactive">Сохранить</div>
                            }
                        </div>
                    </div>
                </div>
            }
		</div>
	);
}