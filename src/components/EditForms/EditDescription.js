import React, { useState } from 'react';
import jwt_axios from '../../services/JWTaxios';

import Spinner from '../LoaderSpinner/Spinner';


export default function EditDescription({ 
    place,
    setPlace
}) {
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [newDescription, setNewDescription] = useState(place.description);
    const [isDescriptionValid, setDescriptionValid] = useState(false);
    const [popup, setPopup] = useState(false);

    const setDescription = async () => {
        setLoading(true);
        setMessages({});

        await jwt_axios.post("/core/places/update/" + place.id + "/", {
            "description": newDescription
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

    const descriptionValidator = (value) => {
        setNewDescription(value);
        setDescriptionValid(value.length > 0);
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
                            Описание успешно изменено
                        </div>
                    }
                    {messages.status &&
                        <div className="auth-error">
                            {messages.statusText}
                        </div>
                    }
                    <div className="edit-scope">
                        <div className="edit-form-title">
                            Введите новое описание
                        </div>
						<textarea
							name="description"
							maxlength="3000"
							value={newDescription}
							onChange={(e) => descriptionValidator(e.target.value)}
						/>
                        <div className="row">
                            {isDescriptionValid ?
                                <div
                                    tabindex="0"
                                    className="save"
                                    onClick={() => setDescription()}
                                    onKeyDown={(e) => e.key === 'Enter' && setDescription()}
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
