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
    const [allPhotos, setAllPhotos] = useState(place.photos);
    const [deletePhotos, setDeletePhotos] = useState([]);
    const [newMainPhoto, setNewMainPhoto] = useState(place.main_photo && place.main_photo.id);

    const [popup, setPopup] = useState(false);

    const setImages = async () => {
        setLoading(true);
        setMessages({});
        
        if (deletePhotos.length > 0) {
            await jwt_axios.post("/core/image/delete/" + place.id + "/", {
                "photos": deletePhotos
            }, {
                withCredentials: true
            }).then((response) => {
                setPlace(response.data);
                setAllPhotos(response.data.photos);
                setDeletePhotos([]);
            }).catch((error) => {
                alert(error.response.statusText)
            }).finally(() => {
                setLoading(false);
            });
        }

        await jwt_axios.post("/core/place/update/" + place.id + "/", {
            "main_photo": newMainPhoto
        }, {
            withCredentials: true
        }).then((response) => {
            setPlace(response.data);
            setPopup(true);
        }).catch((error) => {
            console.log(error.response)
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
        setLoading(true);

        if (e.target.files && e.target.files.length > 0) {
            const newPromises = [];
            for (let i = 0; i < e.target.files.length; i++) {
                newPromises.push(fileToDataUri(e.target.files[i]));
            }
            const photos = await Promise.all(newPromises);
            
            await jwt_axios.post("/core/image/upload/" + place.id + "/", {
                "photos": [...photos.map((elem) => elem.split(';base64,')[1])]
            }, {
                withCredentials: true
            }).then((response) => {
                setPlace(response.data);
                setAllPhotos(response.data.photos);
            }).catch((error) => {
                alert(error.response.statusText)
            }).finally(() => {
                setLoading(false);
            });
        }
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
                                Photos changed successfully
                            </div>
                        }
                        {messages.status &&
                            <div className="auth-error">
                                {messages.statusText}
                            </div>
                        }
                        <div className="edit-scope">
                            <div className="edit-form-title">
                                Choose your photos
                            </div>
                            <div className="base-row">
                                <label for="upload" className="button active-button">Choose</label>
                            </div>
                            <div className="edit-gallery">
                                {allPhotos && allPhotos.map((image, index) => (
                                    <div key={index} className={deletePhotos.includes(image.id) ? "small-photo to-delete" : "small-photo"}>
                                        <img className="small-photo-img" src={image.thumbnail_uri} alt='' draggable="false" />
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
                                                checked={newMainPhoto === image.id}
                                                onChange={() => setNewMainPhoto(image.id)}
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
                                {newMainPhoto || deletePhotos.length > 0 ?
                                    <div
                                        tabindex="0"
                                        className="save"
                                        onClick={() => {setImages()}}
                                        onKeyDown={(e) => e.key === 'Enter' && setImages()}
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
		</div>
	);
}
