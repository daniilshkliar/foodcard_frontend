import React, { useState } from 'react';
import jwt_axios from '../../services/JWTaxios';

import Spinner from '../LoaderSpinner/Spinner';

import ArrowDownIcon from '../../icons/arrow_down_icon.svg';
import ArrowUpIcon from '../../icons/arrow_up_icon.svg';

import dict from '../../dict.json';


export default function EditCategories({ 
    place,
    setPlace
}) {
    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [newCategories, setNewCategories] = useState(place.categories);
    const [newMainCategory, setNewMainCategory] = useState(place.main_category);
    const [popup, setPopup] = useState(false);
    const [isMainCategoryActive, setMainCategoryActive] = useState(false);

    const setCategories = async () => {
        setLoading(true);
        setMessages({});

        await jwt_axios.post("/core/place/update/" + place.id + "/", {
            "main_category": newMainCategory,
            "categories": newCategories
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

    const handleCategoriesChange = (element) => {
        if (newCategories.includes(element)) {
            setNewCategories([...newCategories.filter(elem => elem !== element)]);
            newMainCategory === element && setNewMainCategory("");
        } else {
            setNewCategories([...newCategories, element]);
        }
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
                            Categories changed successfully
                        </div>
                    }
                    {messages.status &&
                        <div className="auth-error">
                            {messages.statusText}
                        </div>
                    }
                    <div className="edit-scope">
                        <div className="edit-form-title">
                            Choose your categories
                        </div>
                        {dict.categories_src &&
                            <div className="filter-box editable">
                                <div className="filter-body">
                                    {dict.categories_src.map((element, index) => 
                                        <div key={index} className={"button filter-element" + (newCategories.includes(element) ? " active-button" : "")}
                                            onClick={() => handleCategoriesChange(element)}>
                                            {element}
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                        <div className="filter-box half-width margin-right scrollable margin-top">
                            <div className="filter-header clickable" onClick={() => setMainCategoryActive(!isMainCategoryActive)}>
                                Main category
                                <div className="invert arrow">
                                    {isMainCategoryActive ?
                                    <img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
                                    : <img src={ArrowDownIcon} alt={"Arrow down icon"} draggable="false" />
                                    }
                                </div>
                            </div>
                            <div className={isMainCategoryActive ? "filter-location-expanded" : "filter-location-non-expanded"}>
                                <div
                                    className="button filter-element active-button"
                                    onClick={() => {
                                        setMainCategoryActive(!isMainCategoryActive);
                                    }}
                                >
                                    {newMainCategory}
                                </div>
                            </div>
                            {isMainCategoryActive &&
                                <div className="filter-body">
                                    {newCategories.length > 0 ?
                                        newCategories.filter(element => element !== newMainCategory).map((element, index) =>
                                            <div 
                                                key={index} 
                                                className="button filter-element"
                                                onClick={() => setNewMainCategory(element)}
                                            >
                                                {element}
                                            </div>
                                        )
                                    :   <div className="tip small-margin-top">
                                            No options
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                        <div className="row">
                            {newCategories.length > 0 && newMainCategory ?
                                <div
                                    tabindex="0"
                                    className="save"
                                    onClick={() => setCategories()}
                                    onKeyDown={(e) => e.key === 'Enter' && setCategories()}
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
