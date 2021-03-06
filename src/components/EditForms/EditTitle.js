import React, { useState } from 'react';
import jwt_axios from '../../services/JWTaxios';
import { isAlpha } from 'validator';

import Spinner from '../LoaderSpinner/Spinner';


export default function EditTitle({ 
    place,
    setPlace,
    places,
    setPlaces
}) {
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [isTitleValid, setTitleValid] = useState(false);
    const [popup, setPopup] = useState(false);

    const setTitle = async () => {
        setLoading(true);
        setMessages({});

        await jwt_axios.post("/core/places/update/" + place.id + "/", {
            title: newTitle
        }, {
            withCredentials: true 
        }).then((response) => {
            setPlace(response.data);
            let placeDataBefore = places.find(elem => elem.id === place.id);
            placeDataBefore.title = response.data.title;
            setPlaces([...places.filter(elem => elem.id !== place.id), placeDataBefore]);
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

    const titleValidator = (value) => {
        setNewTitle(value);
        setTitleValid(value.length > 0 && value.length <= 70);
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
                            Название успешно изменено
                        </div>
                    }
                    {messages.status &&
                        <div className="auth-error">
                            {messages.statusText}
                        </div>
                    }
                    <div className="edit-scope">
                        <div className="edit-form-title">
                            Введите новое название
                        </div>
                        <div className="base-row">
                            <input
                                type="title"
                                name="title"
                                className={isTitleValid || newTitle.length === 0 ? "input-text" : "input-text invalid"}
                                placeholder={place.title}
                                value={newTitle}
                                onChange={(e) => titleValidator(e.target.value)}
                            />
                        </div>
                        <div className="row">
                            {isTitleValid ?
                                <div
                                    tabindex="0"
                                    className="save"
                                    onClick={() => setTitle()}
                                    onKeyDown={(e) => e.key === 'Enter' && setTitle()}
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