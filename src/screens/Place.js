import React, { useState, useEffect, createRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { YMaps, Map, Placemark, ZoomControl } from 'react-yandex-maps';
import { isAlpha } from 'validator';
import BeautyStars from 'beauty-stars';
import ShowMoreText from 'react-show-more-text';
import moment from 'moment-timezone';

import jwt_axios from '../services/JWTaxios';
import Spinner from '../components/LoaderSpinner/Spinner';
import Header from '../components/Header/Header';
import Slider from '../components/Slider/Slider';
import NotFound from './NotFound';

import '../place.css';

import WebsiteIcon from '../icons/website_icon.svg';
import InstagramIcon from '../icons/instagram_icon.svg';
import ArrowUpIcon from '../icons/arrow_up_icon.svg';
import CloseIcon from '../icons/close_icon.svg';
import PhoneIcon from '../icons/phone_icon.svg';

import dict from '../dict.json';


export default function Place() {
    const history = useHistory();
    const scrollRef = createRef();
    const { city, title } = useParams();
    const [sliderIndex, setSliderIndex] = useState(-1);
    const [isFavorite, setFavorite] = useState(false);
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [isElevatorActive, setElevator] = useState(false);
    const [leaveReview, setLeaveReview] = useState(false);
    const [isFirstNameValid, setFirstNameValid] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [foodNote, setFoodNote] = useState(null);
    const [ambienceNote, setAmbienceNote] = useState(null);
    const [serviceNote, setServiceNote] = useState(null);
    const [noiseNote, setNoiseNote] = useState("");
    const [textReview, setTextReview] = useState("");
    const [sentReview, setSentReview] = useState(false);
    const [isSending, setSending] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [place, setPlace] = useState({});
    const [generalReview, setGeneralReview] = useState({});
    const [photos, setPhotos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [nextPage, setNextPage] = useState(1);

    const [messages, setMessages] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [isReviewsLoading, setReviewsLoading] = useState(false);
    const [isMenuActive, setMenuActive] = useState(false);
    const [isMenuLoading, setMenuLoading] = useState(false);
    const [dishes, setDishes] = useState([]);
    const [menuCategory, setMenuCategory] = useState("csn");

    let day = new Date().getDay() - 1;
    if (day === -1) day = 6;


    useEffect(() => {
        getPlace();
        fetchUser();
        getFavorite();
    }, []);

    const fetchUser = async () => {
        await jwt_axios.get("/accounts/user/", {
            withCredentials: true
        }).then((response) => {
            firstNameValidator(response.data.first_name);
            setAuthenticated(true);
        }).catch((error) => {
            setAuthenticated(false);
        });
    }

    const getPlace = async () => {
        setLoading(true);
        setMessages({});

        await axios.get("/core/places/get/" + city + "/" + title + "/"
        ).then((response) => {
            setPlace(response.data);
            getPhotos(response.data.id);
            getReviews(response.data.id);
            getGeneralReview(response.data.id);
            if (response.data.main_category) setCategories([response.data.main_category, ...response.data.additional_categories]);
            else setCategories(response.data.additional_categories);
            if (response.data.main_cuisine) setCuisines([response.data.main_cuisine, ...response.data.additional_cuisines]);
            else setCuisines(response.data.additional_cuisines);
        }).catch((error) => {
            error.response.status === 404 && setNotFound(true);
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response ||
                error.toString()
            );
        }).finally(() => {
            setLoading(false);
        });
    }

    const getPhotos = async (id) => {
        await axios.get("/core/images/place/get/" + id + "/"
        ).then((response) => {
            setPhotos(response.data);
        });
    }

    const getReviews = async (id) => {
        setReviewsLoading(true);
    
        nextPage && await axios.get("/reviews/list/" + id + "/?page=" + nextPage
        ).then((response) => {
            setReviews([...reviews, ...response.data.results]);
            setNextPage(response.data.next ? nextPage + 1 : null);
        }).finally(() => {
            setReviewsLoading(false);
        });
    }

    const getGeneralReview = async (id) => {
        await axios.get("/reviews/general_review/" + id + "/"
        ).then((response) => {
            setGeneralReview(response.data);
        });
    }

    const getFavorite = async () => {
        await jwt_axios.get("/core/favorites/", {
            withCredentials: true
        }).then((response) => {
            let fav = response.data.find(el => el.place === city + "/" + title + "/");
            setFavorite(fav && fav.place);
        });
    }

    const handleFavorite = async () => {
        setFavorite(!isFavorite);
        await jwt_axios.post("/core/favorites/handle/" + place.id + "/", { withCredentials: true });
    }

    const sendReview = async () => {
        setSending(true);
        setMessages({});

        await jwt_axios.post("/reviews/create/" + place.id + "/", {
            name: firstName,
            food: foodNote,
            ambience: ambienceNote,
            service: serviceNote,
            noise: noiseNote,
            review: textReview
        }, {
            withCredentials: true
        }).then((response) => {
            setReviews([response.data, ...reviews]);
            setSentReview(true);
            firstNameValidator(null);
            setFoodNote(null);
            setAmbienceNote(null);
            setServiceNote(null);
            setNoiseNote(null);
        }).catch((error) => {
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response ||
                error.toString()
            );
        }).finally(() => {
            setSending(false);
        });
    }

    const get_dishes = async (category) => {
        setMenuLoading(true);
        
        await axios.get("/core/dishes/" + place.id + "/" + category + "/"
        ).then((response) => {
            setDishes(response.data);
        }).finally(() => {
            setMenuLoading(false);
        });
    }

    const firstNameValidator = (value) => {
        setFirstName(value);
        setFirstNameValid(isAlpha(value) && value.length > 0 && value.length <= 150);
    }


    return (
        <div>
            {notFound ?
                <NotFound />
            :   <div className="app">
                    <Header isClickable={true} />
                    {isLoading ?
                        <Spinner fixed={true} />
                    :   (messages.statusText ?
                            <div className="account-bar">
                                <div className="auth-error">
                                    {messages.statusText}
                                </div>
                            </div>
                        :   <div>
                                {sliderIndex!==-1 && photos.length > 0 &&
                                    <Slider elements={[...photos.map(elem => elem.image)]} sliderIndex={sliderIndex} setSliderIndex={setSliderIndex} />
                                }
                                <div
                                    className="main"
                                    ref={scrollRef}
                                    onScroll={() => {
                                        setElevator(scrollRef.current.scrollTop >= 800);
                                        if (nextPage && scrollRef.current.scrollHeight - scrollRef.current.scrollTop === scrollRef.current.clientHeight) {
                                            getReviews(place.id);
                                        }
                                    }}
                                >
                                    {isMenuActive &&
                                        <div className="leave-review-background">
                                            <div className="leave-review-window menu-window">
                                                <div
                                                    className="filter-close"
                                                    onClick={() => setMenuActive(false)}
                                                >
                                                    <img src={CloseIcon} alt="Close icon" draggable="false" />
                                                </div>
                                                <div className="auth-title">
                                                    Меню
                                                </div>
                                                {dict.menu_categories &&
                                                    <div className="filter-body menu-view">
                                                        {dict.menu_categories.map((element, index) => 
                                                            <div key={index} className={"button filter-element" + (menuCategory === element[0] ? " active-button" : "")}
                                                                onClick={() => {
                                                                    setMenuCategory(element[0]);
                                                                    get_dishes(element[0]);
                                                                }}>
                                                                {element[1]}
                                                            </div>
                                                        )}
                                                    </div>
                                                }
                                                {isMenuLoading ?
                                                    <div className="margin-top">
                                                        <Spinner small={true} />
                                                    </div>
                                                :   <div className="gallery">
                                                        {dishes && dishes.length > 0 ?
                                                            dishes.map((dish, index) => (
                                                                <div key={index} className="menu-card">
                                                                    <div className="menu-card-photo">
                                                                        {dish.image && <img src={dish.image} alt={"A photo of " + dish.title} draggable="false" />}
                                                                    </div>
                                                                    <div className="reservations-list-element-column">
                                                                        <div className="reservations-list-element-row menu-card-main">
                                                                            <div className="menu-card-title">
                                                                                {dish.title}
                                                                            </div>
                                                                            <div className="menu-card-price">
                                                                                {dish.weight &&
                                                                                    <div className="menu-card-weight">
                                                                                        {dish.weight}г
                                                                                    </div>
                                                                                }
                                                                                {dish.price}
                                                                            </div>
                                                                        </div>
                                                                        {dish.composition &&
                                                                            <div className="reservations-list-element-row">
                                                                                <div className="menu-card-composition">
                                                                                    <ShowMoreText
                                                                                        lines={2}
                                                                                        anchorClass='show-more'
                                                                                    >
                                                                                        {dish.composition}
                                                                                    </ShowMoreText>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                        <div className="reservations-list-element-row nutrients">
                                                                            <div className="reservations-list-element-column menu-card-nutrients">
                                                                                <div className="menu-card-nutrients-header">
                                                                                    калории
                                                                                </div>
                                                                                <div className="menu-card-nutrients-body">
                                                                                    {dish.calories !== null ? dish.calories : "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="reservations-list-element-column menu-card-nutrients">
                                                                                <div className="menu-card-nutrients-header">
                                                                                    жиры
                                                                                </div>
                                                                                <div className="menu-card-nutrients-body">
                                                                                    {dish.fats !== null ? dish.fats : "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="reservations-list-element-column menu-card-nutrients">
                                                                                <div className="menu-card-nutrients-header">
                                                                                    белки
                                                                                </div>
                                                                                <div className="menu-card-nutrients-body">
                                                                                    {dish.proteins !== null ? dish.proteins : "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="reservations-list-element-column menu-card-nutrients">
                                                                                <div className="menu-card-nutrients-header">
                                                                                    углеводы
                                                                                </div>
                                                                                <div className="menu-card-nutrients-body">
                                                                                    {dish.carbohydrates !== null ? dish.carbohydrates : "-"}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        :   <div className="tip margin-bottom">Блюд нет</div>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    }
                                    {isAuthenticated && leaveReview &&
                                        <div className="leave-review-background">
                                            <div className="leave-review-window">
                                                <div
                                                    className="filter-close"
                                                    onClick={() => setLeaveReview(false)}
                                                >
                                                    <img src={CloseIcon} alt="Close icon" draggable="false" />
                                                </div>
                                                {isSending ?
                                                    <Spinner small={true} />
                                                :   sentReview ?
                                                        <div className="reserved-info">
                                                            Спасибо за ваш отзыв
                                                            <div className="confirm-buttons">
                                                                <div tabIndex="0" className="button" onClick={() => setLeaveReview(false)}>Пожалуйста</div>
                                                            </div>
                                                        </div>
                                                    :   <div>
                                                            <div className="rrrow leave-review">
                                                                <div className="reservation-element">
                                                                    <div className="form-element-title">
                                                                        Имя
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        name="firstName"
                                                                        className={isFirstNameValid ? "input-text" : "input-text invalid"}
                                                                        value={firstName}
                                                                        onChange={(e) => firstNameValidator(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="rrrow leave-review">
                                                                <div className="note-title">
                                                                    Еда
                                                                </div>
                                                                <div className="review-rating">
                                                                    <BeautyStars
                                                                        value={foodNote}
                                                                        size="20px"
                                                                        gap="4px"
                                                                        inactiveColor="#DADADA"
                                                                        activeColor="#ED6E2D"
                                                                        onChange={(value) => setFoodNote(value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="rrrow leave-review">
                                                                <div className="note-title">
                                                                    Обслуживание
                                                                </div>
                                                                <div className="review-rating">
                                                                    <BeautyStars
                                                                        value={serviceNote}
                                                                        size="20px"
                                                                        gap="4px"
                                                                        inactiveColor="#DADADA"
                                                                        activeColor="#ED6E2D"
                                                                        onChange={(value) => setServiceNote(value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="rrrow leave-review">
                                                                <div className="note-title">
                                                                    Антураж
                                                                </div>
                                                                <div className="review-rating">
                                                                    <BeautyStars
                                                                        value={ambienceNote}
                                                                        size="20px"
                                                                        gap="4px"
                                                                        inactiveColor="#DADADA"
                                                                        activeColor="#ED6E2D"
                                                                        onChange={(value) => setAmbienceNote(value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="rrrow leave-review">
                                                                <div className="note-title">
                                                                    Уровень шума
                                                                </div>
                                                                <div className="review-rating noise">
                                                                    <div className={"button filter-element" + (noiseNote==='S' ? " orange-button" : "")}
                                                                        onClick={() => setNoiseNote('S')}>
                                                                        Низкий
                                                                    </div>
                                                                    <div className={"button filter-element" + (noiseNote==='M' ? " orange-button" : "")}
                                                                        onClick={() => setNoiseNote('M')}>
                                                                        Средний
                                                                    </div>
                                                                    <div className={"button filter-element" + (noiseNote==='L' ? " orange-button" : "")}
                                                                        onClick={() => setNoiseNote('L')}>
                                                                        Высокий
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="rrrow leave-review">
                                                                <div className="reservation-element">
                                                                    <div className="form-element-title">
                                                                        Отзыв
                                                                    </div>
                                                                    <textarea
                                                                        name="text_review"
                                                                        className="input-text"
                                                                        value={textReview}
                                                                        maxlength="2000"
                                                                        onChange={(e) => setTextReview(e.target.value)}
                                                                    ></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="rrrow leave-review">
                                                                <div className="reservation-element review-buttons">
                                                                    <div tabIndex="0" className="button" onClick={() => setLeaveReview(false)}>
                                                                        Отмена
                                                                    </div>
                                                                    {isFirstNameValid && foodNote && ambienceNote && noiseNote && serviceNote ?
                                                                        <div
                                                                            tabIndex="0"
                                                                            className="button orange-button"
                                                                            onClick={() => sendReview()}
                                                                            onKeyDown={(e) => e.key === 'Enter' && sendReview()}
                                                                        >
                                                                            Оставить отзыв
                                                                        </div>
                                                                    :   <div tabindex="0" className="button inactive">Оставить отзыв</div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    }
                                    <div className="place-photos">
                                        <div className="place-photo-container-1">
                                            <div className="color0" onClick={() => setSliderIndex(0)}>
                                                {photos && photos[0] ?
                                                    <img src={photos[0].image} alt="Photo" draggable="false" className="place-photo" />
                                                :   <div id="min-photo-height"></div>
                                                }
                                            </div>
                                            <div className="color1" onClick={() => setSliderIndex(1)}>
                                                {photos && photos[1] && <img src={photos[1].image} alt="Photo" draggable="false" className="place-photo" />}
                                            </div>
                                        </div>
                                        <div className="place-photo-container-2">
                                            <div className="color2" onClick={() => setSliderIndex(2)}>
                                                {photos && photos[2] && <img src={photos[2].image} alt="Photo" draggable="false" className="place-photo" />}
                                            </div>
                                        </div>
                                        <div className="place-photo-container-0">
                                            <div className="color3" onClick={() => setSliderIndex(3)}>
                                                {photos && photos[3] && <img src={photos[3].image} alt="Photo" draggable="false" className="place-photo" />}
                                            </div>
                                        </div>
                                        <div className="place-photo-container-3">
                                            <div className="place-photo-container-4">
                                                <div className="color4" onClick={() => setSliderIndex(4)}>
                                                    {photos && photos[4] && <img src={photos[4].image} alt="Photo" draggable="false" className="place-photo" />}
                                                </div>
                                            </div>
                                            <div className="place-photo-container-5">
                                                <div className="color5" onClick={() => setSliderIndex(5)}>
                                                    {photos && photos[5] && <img src={photos[5].image} alt="Photo" draggable="false" className="place-photo" />}
                                                </div>
                                                <div className="color6" onClick={() => setSliderIndex(6)}>
                                                    {photos && photos[6] && <img src={photos[6].image} alt="Photo" draggable="false" className="place-photo" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="place-window">
                                        <div className="place-title">
                                            {place.title}
                                        </div>
                                        <div className="place-row">
                                            <div className="button active-button" onClick={() => history.push("/reservation/" + city + "/" + title + "/")}>Резервация</div>
                                            {isAuthenticated &&
                                                <div className={"favorite" + (isFavorite ? " active-button" : "")} onClick={() => handleFavorite()}>❥</div>
                                            }
                                        </div>
                                        <div className="place-categories">
                                            {categories && categories.map((elem, index, arr) => (
                                                <div key={index} className="place-category">
                                                    {dict.categories_src_dict[elem.name]}
                                                    {index !== (arr.length - 1) && <div class="dot"></div>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="place-cuisines">
                                            {cuisines && cuisines.map((elem, index, arr) => (
                                                <div key={index} className="place-cuisine">
                                                    {dict.cuisines_src_dict[elem.name]} кухня
                                                    {index !== (arr.length - 1) && <div class="dot"></div>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="place-dashboard">
                                            <div className="button" onClick={() => setMenuActive(true)}>Меню</div>
                                            {place.website &&
                                                <div className="icon-link"><a href={place.website} target="_blank"><img className="website-icon" src={WebsiteIcon} alt="Website icon" /></a></div>
                                            }
                                            {place.instagram &&
                                                <div className="icon-link"><a href={place.instagram} target="_blank"><img className="instagram-icon" src={InstagramIcon} alt="Instagram icon" /></a></div>
                                            }
                                            <div className="button invert" onClick={() => window.open("tel:+" + place.phone.replace(/[^0-9]/g, ""), "_self")}>
                                                <img className="phone-icon" src={PhoneIcon} alt="Phone icon" />
                                                {place.phone}
                                            </div>
                                        </div>
                                        <div className="place-description-container">
                                            <div className="place-header">
                                                <div>Описание</div>
                                            </div>
                                            <div className="place-description">
                                                <ShowMoreText
                                                    lines={9}
                                                    anchorClass='show-more'
                                                >
                                                    {place.description}
                                                </ShowMoreText>
                                            </div>
                                            <div
                                                className="place-reviews"
                                            >
                                                <div className="place-header">
                                                    Отзывы
                                                </div>
                                                {isAuthenticated ?
                                                    <div className="button" onClick={() => setLeaveReview(true)}>
                                                        Оставить отзыв
                                                    </div>
                                                :   <div className="tip left-side">
                                                        <div className="login-tip" onClick={() => history.push("/login")}>Авторизуйтесь</div>
                                                        , чтобы оставить отзыв
                                                    </div>
                                                }
                                                {isElevatorActive && 
                                                    <div className="elevator" onClick={() => scrollRef.current.scrollTo(0, 0)}>
                                                        <img src={ArrowUpIcon} alt="Arrow up icon" draggable="false" />
                                                    </div>
                                                }
                                                {reviews && reviews.map((review, index) => (
                                                    <div key={review.id} className="place-review">
                                                        <div className="review-user">
                                                            <div className={"user-avatar color" + review.id.toString().slice(-1)}>
                                                                {review.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="review-username">{review.name}</div>
                                                            <div className="review-rating">
                                                                <BeautyStars
                                                                    value={review.overall}
                                                                    size="15px"
                                                                    editable="false"
                                                                    gap="3px"
                                                                    inactiveColor="#DADADA"
                                                                    activeColor="#ED6E2D"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="place-review-column">
                                                            <div className="review-date">{moment.tz(review.created_at, place.timezone).format("D MMM YYYY, HH:mm")}</div>
                                                            <div className="review-notes">
                                                                <div className="place-row">
                                                                    <div className="place-general-review-column">
                                                                        <div className="place-header review">
                                                                            Еда
                                                                        </div>
                                                                        <div className="place-general-review-column-body review">
                                                                            {review.food}
                                                                        </div>
                                                                    </div>
                                                                    <div className="place-general-review-column">
                                                                        <div className="place-header review">
                                                                            Обслуживание
                                                                        </div>
                                                                        <div className="place-general-review-column-body review">
                                                                            {review.service}
                                                                        </div>
                                                                    </div>
                                                                    <div className="place-general-review-column">
                                                                        <div className="place-header review">
                                                                            Антураж
                                                                        </div>
                                                                        <div className="place-general-review-column-body review">
                                                                            {review.ambience}
                                                                        </div>
                                                                    </div>
                                                                    <div className="place-general-review-column">
                                                                        <div className="place-header review">
                                                                            Уровень шума
                                                                        </div>
                                                                        <div className="place-general-review-column-body review">
                                                                            {review.noise === 'L' ? "Высокий" : (review.noise === 'M' ? "Средний" : "Низкий")}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="review-text">
                                                                <ShowMoreText
                                                                    lines={2}
                                                                    anchorClass='show-more'
                                                                >
                                                                    {review.review}
                                                                </ShowMoreText>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {isReviewsLoading && <Spinner small={true} />}
                                            </div>
                                        </div>
                                        <div className="place-general-review">
                                            <div className="place-row">
                                                <div className="place-general-review-overal-rounded">
                                                    {generalReview && generalReview.rating}
                                                </div>
                                                <BeautyStars
                                                    value={generalReview.rounded_rating}
                                                    size="20px"
                                                    gap="4px"
                                                    editable="false"
                                                    inactiveColor="#DADADA"
                                                    activeColor="#ED6E2D"
                                                />
                                                <div className="place-general-review-overall-amount">
                                                    ({generalReview && (generalReview.amount + (generalReview.amount === 1 ? " отзыв" : generalReview.amount <= 4 ? " отзыва" : " отзывов"))})
                                                </div>
                                            </div>
                                            {generalReview && generalReview.amount > 0 &&
                                                <div>
                                                    <div className="place-row">
                                                        <div className="place-general-review-column">
                                                            <div className="place-header">
                                                                Еда
                                                            </div>
                                                            <div className="place-general-review-column-body">
                                                                {generalReview.food}
                                                            </div>
                                                        </div>
                                                        <div className="place-general-review-column">
                                                            <div className="place-header">
                                                                Обслуживание
                                                            </div>
                                                            <div className="place-general-review-column-body">
                                                                {generalReview.service}
                                                            </div>
                                                        </div>
                                                        <div className="place-general-review-column">
                                                            <div className="place-header">
                                                                Антураж
                                                            </div>
                                                            <div className="place-general-review-column-body">
                                                                {generalReview.ambience}
                                                            </div>
                                                        </div>
                                                        <div className="place-general-review-column">
                                                            <div className="place-header">
                                                                Уровень шума
                                                            </div>
                                                            <div className="place-general-review-column-body">
                                                                {generalReview.noise === 'L' ? "Высокий" : (generalReview.noise === 'M' ? "Средний" : "Низкий")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="place-general-review-chart">
                                                        {generalReview && generalReview.distribution && generalReview.distribution.map((elem, index) => (
                                                            <div key={index} className="place-general-review-chart-line">
                                                                <div className="place-general-review-chart-line-label">{index + 1}</div>
                                                                <div className="place-general-review-chart-line-value">
                                                                    <div
                                                                        className="place-general-review-chart-line-progress"
                                                                        style={{ width: (elem*100)/generalReview.amount + "%" }}
                                                                    >
                                                                </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            }
                                            <div className="place-additional">
                                                <div className="place-header">
                                                    Дополнительно
                                                </div>
                                                <div className="place-body">
                                                    {place.additional_services && place.additional_services.map((elem, index) => (
                                                        <div key={index}>
                                                            {dict.additional_src_dict[elem.name]}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="place-opening-hours">
                                                <div className="place-header">
                                                    График работы
                                                </div>
                                                <div className="place-body">
                                                    {place.opening_hours && place.opening_hours.map((elem, index) => (
                                                        <div key={index} className="place-opening-hours-row">
                                                            <div className="place-weekday">
                                                                {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][index]}
                                                            </div>
                                                            {index === day && <div className="orange-dot"></div>}
                                                            <div>
                                                                {elem[0] === null && elem[1] === null ?
                                                                    ('Выходной')
                                                                :   (moment.utc(elem[0]).tz(place.timezone).format("HH:mm")
                                                                    + " - " + 
                                                                    moment.utc(elem[1]).tz(place.timezone).format("HH:mm"))
                                                                }
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="place-address">
                                                <div className="place-header">
                                                    Адрес
                                                </div>
                                                {place.country && place.city && place.street && place.coordinates &&
                                                    <div className="place-body">
                                                        <div>
                                                            {dict.countries_src_dict[place.country.name] + ", " + dict.cities_src_dict[place.city] + ", " + place.street}
                                                        </div>
                                                        <div className="place-map">
                                                            <YMaps>
                                                                <Map className="main-map" state={{ center: [place.coordinates[0], place.coordinates[1]], zoom: 12 }}>
                                                                    <ZoomControl options={{ size: 'small', position: { bottom: 30, right: 10 }}} />
                                                                    <Placemark
                                                                        geometry={[place.coordinates[0], place.coordinates[1]]}
                                                                        options={{ iconColor: 'red' }}
                                                                    />
                                                                </Map>
                                                            </YMaps>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>                          
            }
        </div>
    );
}