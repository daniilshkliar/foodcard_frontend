import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import AccountBar from '../AccountBar/AccountBar';

import './header.css';

import AccountIcon from '../../icons/account_icon.svg';


export default function Header({ isClickable }) {

    const history = useHistory();
    const [isAccountBarActive, setAccountBarActive] = useState(false);

	return (
        <div>
			<div className="header fade1">
				{isClickable ?
					<div className="clickable logo-place" onClick={() => history.push("/")}>FOODCARD</div>
					: 	<div className="logo-place">FOODCARD</div>
                }
				<div className="icons">
                    <img
                        src={AccountIcon}
                        className="account-icon"
                        alt="Account icon"
                        draggable="false"
                        onClick={() => setAccountBarActive(!isAccountBarActive)}/>
				</div>
            </div>
            <AnimatePresence>
                {isAccountBarActive &&
                    <div>
                        <motion.div
                            className="account-background"
                            onClick={() => setAccountBarActive(!isAccountBarActive)}
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
                            <AccountBar />
                        </motion.div>
                    </div>
                }
            </AnimatePresence>
		</div>
	);
}
