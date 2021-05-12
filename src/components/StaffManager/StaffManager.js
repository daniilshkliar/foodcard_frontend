import React, { useState, useEffect, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_axios from '../../services/JWTaxios';
import axios from 'axios';
import ShowMoreText from 'react-show-more-text';
import moment from 'moment-timezone';
import { isEmail } from 'validator';

import Spinner from '../LoaderSpinner/Spinner';
import Reservation from '../../screens/Reservation';
import _ from "lodash";

import AccountIcon from '../../icons/account_icon.svg';
import StairsIcon from '../../icons/stairs_icon.png';
import VipIcon from '../../icons/vip_icon.png';
import CloseIcon from '../../icons/close_icon.svg';
import ArrowUpIcon from '../../icons/arrow_up_icon.svg';
import DepositIcon from '../../icons/deposit_icon.png';
import PhoneIcon from '../../icons/phone_icon.svg';


export default function StaffManager({ 
    id,
    setPlace
}) {
    const history = useHistory();
    const [messages, setMessages] = useState("");
    const [isLoading, setLoading] = useState(false);
    
    const [isDeleting, setDeleting] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    const [isDeleteStaff, setDeleteStaff] = useState(false);

    const [staff, setStaff] = useState([]);
    const [userID, setUserID] = useState(null);


    useEffect(() => {
        getStaff();
    }, [id]);

    const getStaff = async () => {
        setLoading(true);
        setMessages("");

        await jwt_axios.get("/tools/staff/list/" + id + "/", {
            withCredentials: true
        }).then((response) => {
            let array = []
            for (let [key, value] of Object.entries(_.groupBy(response.data, 'user.id'))) {
                array.push({
                    id: key,
                    first_name: value[0].user.first_name,
                    last_name: value[0].user.last_name,
                    email: value[0].user.email,
                    phone: value[0].user.phone,
                    permissions: value.map(elem => elem.permission)
                })
            }
            setStaff(array);
        }).catch((error) => {
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

    const handlePermissionChange = async (permission, user, create) => {
        create ?
            await jwt_axios.post('/tools/staff/create/' + id + '/', {
                user: user,
                permission: permission
            }, {
                withCredentials: true 
            }).then((response) => {
                getStaff();
            })
        :   await jwt_axios.post('/tools/staff/delete/' + id + '/', {
                user: user,
                permission: permission
            }, {
                withCredentials: true 
            }).then((response) => {
                getStaff();
            })
    }

    const handleDelete = async () => {
        setDeleting(true);
        setMessages("");
        
        console.log(userID)
        await jwt_axios.post('/tools/staff/fire/' + id + '/', {
            user: deleteID
        }, {
            withCredentials: true 
        }).then((response) => {
            setStaff(staff.filter(elem => elem.id !== deleteID))
        }).finally(() => {
            setDeleteID(null);
            setDeleteStaff(false);
            setDeleting(false);
        }).catch((error) => {
            setMessages(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response ||
                error.toString()
            );
        });
    }

    
	return (
		<div>
            {isDeleteStaff &&
                <div className="reservation-delete-background">
                    <div className="reservation-delete-window">
                        <div
                            className="filter-close"
                            onClick={() => {
                                setDeleteStaff(false);
                                setDeleteID(null);
                            }}
                        >
                            <img src={CloseIcon} alt="Close icon" draggable="false" />
                        </div>
                        {isDeleting ?
                            <Spinner small={true} />
                        :   <div className="delete-info">
                                Вы действительно хотите удалить сотрудника?
                                <div className="confirm-buttons">
                                    <div tabIndex="0" className="button cancel-button" onClick={() => handleDelete()}>Да</div>
                                    <div tabIndex="0" className="button" onClick={() => {
                                        setDeleteStaff(false);
                                        setDeleteID(null);
                                    }}>
                                        Нет
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
            <div className="edit-scope">
                {messages.length > 0 &&
                    <div className="auth-error">
                        {messages}
                    </div>
                }
                <div className="edit-form-title">
                    Список сотрудников
                </div>
                <div class="reservations-scope">
                    <div className="reservations-list-element-row staff-add">
                        <div className="staff-add-title">
                            Номер
                        </div>
                        <input
                            type="number"
                            name="id"
                            min="0"
                            step="1"
                            className="input-text"
                            value={userID}
                            onChange={(e) => setUserID(e.target.value >= 0 ? e.target.value : -e.target.value)}
                        />
                        {userID ?
                            <div
                                tabindex="0"
                                className="button"
                                onClick={() => handlePermissionChange('view_place', userID, true)}
                                onKeyDown={(e) => e.key === 'Enter' && handlePermissionChange('view_place', userID, true)}
                            >
                                Добавить сотрудника
                            </div>
                        :   <div tabindex="0" className="button inactive">Добавить сотрудника</div>
                        }
                    </div>
                    <div>
                        {!isLoading && (staff.length === 0 ?
                            <div className="tip reservations-margin-top">
                                У вас нет сотрудников
                            </div>
                        :   staff.map((elem, index) => (
                                <div key={index} className="reservations-list-element-row reservations-list-card">
                                    <div className="reservations-list-element-column">
                                        <div className="reservations-list-element-row">
                                            <div className="reservations-list-element-column el-first-last-name">
                                                <div className="staff-list-first-name">
                                                    {elem.first_name}
                                                </div>
                                                <div className="staff-list-last-name">
                                                    {elem.last_name}
                                                </div>
                                            </div>
                                            <div className="staff-list-email">
                                                {elem.email}
                                            </div>
                                            <div className="staff-list-phone">
                                                <div className="button invert" onClick={() => window.open("tel:+" + elem.phone.replace(/[^0-9]/g, ""), "_self")}>
                                                    <img className="phone-icon" src={PhoneIcon} alt="Phone icon" />
                                                    {elem.phone}
                                                </div>
                                            </div>
                                            <div
                                                className="reservations-list-delete"
                                                onClick={() => {
                                                    setDeleteID(elem.id);
                                                    setDeleteStaff(true);
                                                }}
                                            >
                                                <img src={CloseIcon} alt="Close icon" draggable="false" />
                                            </div>
                                        </div>
                                        <div className="reservations-list-element-row reservations-list-comment">
                                            <div className="edit-row staff-checkbox">
                                                <div className="label">
                                                    Просмотр:
                                                </div>
                                                <label class="control control-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name="view_place"
                                                        checked={elem.permissions && elem.permissions.includes('view_place')}
                                                        onChange={() => elem.permissions && (elem.permissions.includes('view_place') ?
                                                            handlePermissionChange('view_place', elem.id, false)
                                                        :   handlePermissionChange('view_place', elem.id, true))
                                                        }
                                                    />
                                                    <div class="control_indicator"></div>
                                                </label>
                                            </div>
                                            <div className="edit-row staff-checkbox">
                                                <div className="label">
                                                    Изменение:
                                                </div>
                                                <label class="control control-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name="change_place"
                                                        checked={elem.permissions && elem.permissions.includes('change_place')}
                                                        onChange={() => elem.permissions && (elem.permissions.includes('change_place') ?
                                                            handlePermissionChange('change_place', elem.id, false)
                                                        :   handlePermissionChange('change_place', elem.id, true))
                                                        }
                                                    />
                                                    <div class="control_indicator"></div>
                                                </label>
                                            </div>
                                            <div className="edit-row staff-checkbox">
                                                <div className="label">
                                                    Управление:
                                                </div>
                                                <label class="control control-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name="manage_place"
                                                        checked={elem.permissions && elem.permissions.includes('manage_place')}
                                                        onChange={() => elem.permissions && (elem.permissions.includes('manage_place') ?
                                                            handlePermissionChange('manage_place', elem.id, false)
                                                        :   handlePermissionChange('manage_place', elem.id, true))
                                                        }
                                                    />
                                                    <div class="control_indicator"></div>
                                                </label>
                                            </div>
                                            <div className="edit-row staff-checkbox">
                                                <div className="label">
                                                    Удаление:
                                                </div>
                                                <label class="control control-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name="delete_place"
                                                        checked={elem.permissions && elem.permissions.includes('delete_place')}
                                                        onChange={() => elem.permissions && (elem.permissions.includes('delete_place') ?
                                                            handlePermissionChange('delete_place', elem.id, false)
                                                        :   handlePermissionChange('delete_place', elem.id, true))
                                                        }
                                                    />
                                                    <div class="control_indicator"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {isLoading && <Spinner small={true} />}
                </div>
            </div>
        </div>
    )
}