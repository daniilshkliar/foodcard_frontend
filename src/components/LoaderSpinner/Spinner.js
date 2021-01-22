import React from 'react';

import './spinner.css';


export default function Spinner({ small, fixed }) {
    return (
        <div className={(small ? "small-loading-background" : "loading-background") + (fixed ? " loading-fixed" : "")}>
            <div className={small ? "small-loading-animation" : "loading-animation"}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}