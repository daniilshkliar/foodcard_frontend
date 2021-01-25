import React, { useState } from 'react';
import jwt_axios from '../../services/JWTaxios';

import Spinner from '../LoaderSpinner/Spinner';

import CloseIcon from '../../icons/close_icon.svg';


export default function EditPhotos({ 
    place,
    setPlace
}) {
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [newPhotos, setNewPhotos] = useState(place.photos ? place.photos : []);
    const [newMainPhoto, setNewMainPhoto] = useState(place.main_photo);
    const [popup, setPopup] = useState(false);

    const setPhotos = async () => {
        setLoading(true);
        setMessages({});
        let photos = [...newPhotos.map((elem) => elem.split(';base64,')[1]).filter((elem) => elem !== undefined)]
        
        await jwt_axios.post("/core/place/update/" + place.id + "/", {
            "main_photo": newMainPhoto.split(';base64,')[1],
            "photos": photos
        }, {
            withCredentials: true
        }).then((response) => {
            setPlace(response.data);
            setNewPhotos(response.data.photos);
            setNewMainPhoto(response.data.main_photo);
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

    const fileToDataUri = (image) => {
        return new Promise((res) => {
            const reader = new FileReader();
            reader.onload = () => {
                res(reader.result);
            }
            reader.readAsDataURL(image);
        })
    }

    const uploadImages = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newPromises = [];
            for (let i = 0; i < e.target.files.length; i++) {
                newPromises.push(fileToDataUri(e.target.files[i]));
            }
            const photos = await Promise.all(newPromises);
            setNewPhotos([...newPhotos, ...photos]);
            
        }
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
                            Choose your photos
                        </div>
                        <div className="base-row">
                            <label for="upload" className="button orange-button">Choose</label>
                        </div>
                        <div className="edit-gallery">
                            {newPhotos.length > 0 && newPhotos.map((image, index) => (
                                <div key={index} className="small-photo">
                                    <img src={image} alt='' draggable="false" />
                                    <div
                                        className="close"
                                        // onClick={() => setMapOpen(!isMapOpen)}
                                    >
                                        <img src={CloseIcon} alt="Close icon" draggable="false" />
                                    </div>
                                    <input
                                        type="radio"
                                        value={index}
                                        name="set-main-photo"
                                        className="set-main-photo"
                                        checked={newMainPhoto === image}
                                        onChange={() => setNewMainPhoto(image)}
                                    />
                                </div>
                            ))}
                        </div>
                        <input
                            type="file"
                            id="upload"
                            accept="image/png, image/jpeg"
                            multiple
                            hidden
                            onChange={(e) => uploadImages(e)}
                        />
                        <div className="row">
                            {newMainPhoto && newPhotos.length > 0 ?
                                <div
                                    tabindex="0"
                                    className="save"
                                    onClick={() => {setPhotos()}}
                                    onKeyDown={(e) => e.key === 'Enter' && setPhotos()}
                                >
                                    Save
                                </div>
                            :   <div tabindex="0" className="button inactive">Save</div>
                            }
                        </div>
                    </div>
                    {popup &&
                        <div className="popup">
                            Photos changed successfully
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
