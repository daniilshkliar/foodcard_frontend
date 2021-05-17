import React, { useState, useEffect } from 'react';
import jwt_axios from '../../services/JWTaxios';
import axios from 'axios';
import Spinner from '../LoaderSpinner/Spinner';

import CloseIcon from '../../icons/close_icon.svg';


export default function EditPhotos({ 
    place,
    setPlace
}) {
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [allPhotos, setAllPhotos] = useState([]);
    const [deletePhotos, setDeletePhotos] = useState([]);
    const [mainPhotoThumbnail, setMainPhotoThumbnail] = useState(place.main_photo);
    const [newMain, setNewMain] = useState(-1);

    const [popup, setPopup] = useState(false);
    
    useEffect(() => {
        get_images();
    }, []);

    const get_images = async () => {
        setLoading(true);
        
        await axios.get("/core/images/place/get/" + place.id + "/"
        ).then((response) => {
            setAllPhotos(response.data);
            setDeletePhotos([]);
        }).finally(() => {
            setLoading(false);
        });
    }

    const setImages = async () => {
        setLoading(true);
        setMessages({});
        
        if (newMain != -1 && deletePhotos.filter((elem) => elem === newMain).length == 0) {
            await jwt_axios.post("/core/images/place/set_main/" + place.id + "/" + newMain + "/", {
                withCredentials: true
            }).then((response) => {
                place.main_photo = mainPhotoThumbnail
                setPlace(place);
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

        setLoading(true);
        setMessages({});

        if (deletePhotos.length > 0) {
            await jwt_axios.post("/core/images/place/delete/" + place.id + "/", {
                "photos": deletePhotos
            }, {
                withCredentials: true
            }).then((response) => {
                setAllPhotos(response.data);
                setDeletePhotos([]);
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
        
        setLoading(false);
    }

    const uploadImages = async (e) => {
        setLoading(true);

        let formData = new FormData();
        for (let i = 0; i < e.target.files.length; i++) {
            formData.append("photos", e.target.files[i]);
        }

        await jwt_axios.post("/core/images/place/upload/" + place.id + "/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        }).then((response) => {
            setAllPhotos(response.data);
        }).finally(() => {
            setLoading(false);
        });
    }

	return (
		<div>
            <div>
                {isLoading ?
                    <div className="margin-top">
                        <Spinner small={true} />
                    </div>
                :   <div>
                        {popup &&
                            <div className="popup">
                                Изменения успешно внесены
                            </div>
                        }
                        {messages.status &&
                            <div className="auth-error">
                                {messages.statusText}
                            </div>
                        }
                        <div className="edit-scope">
                            <div className="edit-form-title">
                                Выберите фотографии
                            </div>
                            <div className="base-row">
                                <label for="upload" className="button active-button">Выбрать</label>
                            </div>
                            <div className="edit-gallery">
                                {allPhotos && allPhotos.map((image, index) => (
                                    <div key={index} className={deletePhotos.includes(image.id) ? "small-photo to-delete" : "small-photo"}>
                                        <img className="small-photo-img" src={image.thumbnail} alt='' draggable="false" />
                                        <div
                                            className="for-deletion"
                                            onClick={() => {
                                                deletePhotos.includes(image.id) ?
                                                    setDeletePhotos([...deletePhotos.filter(elem => elem!==image.id)])
                                                :   setDeletePhotos([...deletePhotos, image.id])
                                            }}
                                        >
                                            <img src={CloseIcon} alt="Close icon" draggable="false" />
                                        </div>
                                        <label className="radio">
                                            <input
                                                type="radio"
                                                value={image.id}
                                                name="set-main-photo"
                                                className="set-main-photo"
                                                checked={newMain === image.id || image.thumbnail.includes(mainPhotoThumbnail)}
                                                onChange={() => {
                                                    setNewMain(image.id);
                                                    setMainPhotoThumbnail(image.thumbnail);
                                                }}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label for={"radio" + index} className=""></label>
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
                                {newMain !== -1 || deletePhotos.length > 0 ?
                                    <div
                                        tabindex="0"
                                        className="save"
                                        onClick={() => {setImages()}}
                                        onKeyDown={(e) => e.key === 'Enter' && setImages()}
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
		</div>
	);
}
