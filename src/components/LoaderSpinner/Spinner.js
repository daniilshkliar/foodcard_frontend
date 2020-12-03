import React from 'react';

import './spinner.css';


export default function Spinner({ small }) {
    return (
        <div className={small === true ? "small-loading-background" : "loading-background"}>
            <div className={small === true ? "small-loading-animation" : "loading-animation"}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}