import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Spinner from '../LoaderSpinner/Spinner';
import axiosApiInstance from '../../services/TokenWrap';
import { motion, AnimatePresence } from "framer-motion";

import './header.css';

// import MenuIcon from '../../icons/menu_icon.svg';
import AccountIcon from '../../icons/account_icon.svg';


export default function Header({ isClickable }) {

	const history = useHistory();
	const [isAccountActive, setAccountActive] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    // const [messages, setMessages] = useState("");


    // useEffect(() => {
    //     setLoading(true);

    //     const fetchData = async () => {
    //         const data = await axiosApiInstance.get("http://127.0.0.1:8000/api/isit/", {});
    //         setMessages(data.data.response);
    //     };

    //     fetchData();
    //     setLoading(false);
	// }, []);
	

	return (
        <div>
			<div className="header fade1">
				{isClickable ?
					<div className="clickable logo-place" onClick={() => history.push("/")}>FOODCARD</div>
					: 	<div className="logo-place">FOODCARD</div>}
				<div className="icons">
					<img
						src={AccountIcon}
						className="account-icon"
						alt="Account icon"
						draggable="false"
						onClick={() => setAccountActive(!isAccountActive)}/>
				</div>
            </div>
            <AnimatePresence>
                {isAccountActive && 
                    <div>
                        <motion.div
                            className="account-background"
                            onClick={() => setAccountActive(!isAccountActive)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div
                            className="account-window"
                            transition={{ duration: 0.4 }}
                            initial={{ right: "-300px" }}
                            animate={{ right: "0px" }}
                            exit={{ right: "-300px" }}
                        >
                        </motion.div>
                    </div>
                }
            </AnimatePresence>
		</div>
	);
}
