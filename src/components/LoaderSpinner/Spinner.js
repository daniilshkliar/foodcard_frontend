import React from 'react';

import './spinner.css';


export default function Spinner() {
    return (
        <div class="loading-background">
            <div class="loading-animation">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}